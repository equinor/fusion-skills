param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [Parameter(Mandatory = $true)]
  [int]$Issue,

  [Parameter(Mandatory = $true)]
  [ValidateSet("Feature", "User Story", "Task", "Bug")]
  [string]$Type,

  [switch]$Yes,
  [switch]$DryRun
)

if ($Repo -notmatch '^[^/]+/[^/]+$') {
  Write-Error "Invalid -Repo '$Repo'. Use owner/repo."
  exit 1
}

$repoParts = $Repo.Split('/', 2)
$owner = $repoParts[0]
$name = $repoParts[1]

$readQuery = @'
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      id
      number
      title
      url
    }
    issueTypes(first: 100) {
      nodes {
        id
        name
      }
    }
  }
}
'@

$updateMutation = @'
mutation($issueId: ID!, $issueTypeId: ID!) {
  updateIssue(input: {id: $issueId, issueTypeId: $issueTypeId}) {
    issue {
      number
      title
      url
      issueType {
        name
      }
    }
  }
}
'@

$verifyQuery = @'
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      number
      title
      url
      issueType {
        name
      }
    }
  }
}
'@

$lookupCmd = "gh api graphql -f query=\"$readQuery\" -F owner=\"$owner\" -F name=\"$name\" -F number=\"$Issue\""
$mutateCmd = 'gh api graphql -f query="<update-mutation>" -F issueId=<issue-node-id> -F issueTypeId=<issue-type-node-id>'
$verifyCmd = "gh api graphql -f query=\"<verify-query>\" -F owner=$owner -F name=$name -F number=$Issue"

if ($DryRun) {
  Write-Output "DRY RUN: $lookupCmd"
  Write-Output "DRY RUN: $mutateCmd"
  Write-Output "DRY RUN: $verifyCmd"
  exit 0
}

if (-not $Yes) {
  Write-Error "Refusing to mutate GitHub state without -Yes. Use -DryRun first."
  exit 1
}

try {
  $lookupJson = gh api graphql -f query="$readQuery" -F owner="$owner" -F name="$name" -F number="$Issue" | ConvertFrom-Json
}
catch {
  Write-Error "Failed to read issue metadata for #$Issue in $Repo. Original error: $($_.Exception.Message)"
  exit 1
}

$issueNodeId = $lookupJson.data.repository.issue.id
if ([string]::IsNullOrWhiteSpace($issueNodeId)) {
  Write-Error "Issue #$Issue was not found in $Repo, or issue metadata is unavailable."
  exit 1
}

$issueTypeNode = $lookupJson.data.repository.issueTypes.nodes | Where-Object { $_.name -eq $Type } | Select-Object -First 1
if ($null -eq $issueTypeNode) {
  $availableTypes = ($lookupJson.data.repository.issueTypes.nodes | ForEach-Object { $_.name }) -join ', '
  Write-Error "Issue type '$Type' is not available in $Repo. Available issue types: $availableTypes"
  exit 1
}

try {
  gh api graphql -f query="$updateMutation" -F issueId="$issueNodeId" -F issueTypeId="$($issueTypeNode.id)" | Out-Null
}
catch {
  Write-Error "Failed to set issue type for #$Issue in $Repo. GraphQL updateIssue failed. Repository configuration or token permissions may block issue type updates. Original error: $($_.Exception.Message)"
  exit 1
}

$verifyResult = gh api graphql -f query="$verifyQuery" -F owner="$owner" -F name="$name" -F number="$Issue" | ConvertFrom-Json
$issueData = $verifyResult.data.repository.issue
$typeName = if ($null -ne $issueData.issueType -and -not [string]::IsNullOrWhiteSpace($issueData.issueType.name)) { $issueData.issueType.name } else { "(unset)" }
Write-Output ("#{0} {1} | {2} | issueType={3}" -f $issueData.number, $issueData.title, $issueData.url, $typeName)
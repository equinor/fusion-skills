param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [Parameter(Mandatory = $true)]
  [int]$Parent,

  [Parameter(Mandatory = $true)]
  [string]$Children,

  [switch]$Yes,
  [switch]$DryRun
)

$childNumbers = $Children -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

if ($childNumbers.Count -eq 0) {
  Write-Error "No child issues provided in -Children."
  exit 1
}

foreach ($child in $childNumbers) {
  if ($child -notmatch "^[0-9]+$") {
    Write-Error "Invalid child issue '$child'. Use comma-separated integers, e.g. 391,392,393."
    exit 1
  }
}

if ($DryRun) {
  Write-Output "DRY RUN: would link children ($Children) to parent #$Parent in $Repo"
  exit 0
}

if (-not $Yes) {
  Write-Error "Refusing to mutate GitHub state without -Yes. Use -DryRun first."
  exit 1
}

$parentNodeId = gh api "repos/$Repo/issues/$Parent" --jq .node_id

$query = 'mutation($issueId:ID!,$subIssueId:ID!){addSubIssue(input:{issueId:$issueId,subIssueId:$subIssueId}){issue{url}}}'

foreach ($child in $childNumbers) {
  $childNodeId = gh api "repos/$Repo/issues/$child" --jq .node_id
  $result = gh api graphql -f query="$query" -f issueId="$parentNodeId" -f subIssueId="$childNodeId" 2>&1 | Out-String
  if ($LASTEXITCODE -eq 0) {
    Write-Output "Linked child #$child -> parent #$Parent"
    continue
  }

  if ($result -match "already|duplicate|exists") {
    Write-Output "Skipped child #$child (already linked to #$Parent)"
    continue
  }

  Write-Error $result.Trim()
  exit $LASTEXITCODE
}
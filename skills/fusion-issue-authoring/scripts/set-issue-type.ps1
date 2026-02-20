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

$endpoint = "repos/$Repo/issues/$Issue"
$cmdText = "gh api $endpoint --method PATCH --field type=$Type"

if ($DryRun) {
  Write-Output "DRY RUN: $cmdText"
  exit 0
}

if (-not $Yes) {
  Write-Error "Refusing to mutate GitHub state without -Yes. Use -DryRun first."
  exit 1
}

try {
  gh api $endpoint --method PATCH --field "type=$Type" | Out-Null
}
catch {
  Write-Error "Failed to set issue type for #$Issue in $Repo. This repository/API combination may not support issue type mutation via this endpoint, or your token lacks permissions. Original error: $($_.Exception.Message)"
  exit 1
}

$result = gh api $endpoint | ConvertFrom-Json
$typeName = if ($null -ne $result.type) { $result.type } else { "(unset or unavailable)" }
Write-Output ("#{0} {1} | {2} | type={3}" -f $result.number, $result.title, $result.html_url, $typeName)
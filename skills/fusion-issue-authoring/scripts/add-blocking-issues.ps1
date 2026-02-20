param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [Parameter(Mandatory = $true)]
  [int]$Issue,

  [Parameter(Mandatory = $true)]
  [string]$Blocking,

  [switch]$Yes,
  [switch]$DryRun
)

$blockingNumbers = $Blocking -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

if ($blockingNumbers.Count -eq 0) {
  Write-Error "No blocking issues provided in -Blocking."
  exit 1
}

foreach ($blockingIssue in $blockingNumbers) {
  if ($blockingIssue -notmatch "^[0-9]+$") {
    Write-Error "Invalid blocking issue '$blockingIssue'. Use comma-separated integers, e.g. 391,392,393."
    exit 1
  }
}

if ($DryRun) {
  Write-Output "DRY RUN: would link blocking issues ($Blocking) to issue #$Issue in $Repo"
  exit 0
}

if (-not $Yes) {
  Write-Error "Refusing to mutate GitHub state without -Yes. Use -DryRun first."
  exit 1
}

$issueNodeId = gh api "repos/$Repo/issues/$Issue" --jq .node_id

$query = 'mutation($issueId:ID!,$blockingIssueId:ID!){addBlockedBy(input:{issueId:$issueId,blockingIssueId:$blockingIssueId}){issue{url}}}'

foreach ($blockingIssue in $blockingNumbers) {
  $blockingNodeId = gh api "repos/$Repo/issues/$blockingIssue" --jq .node_id
  $result = gh api graphql -f query="$query" -f issueId="$issueNodeId" -f blockingIssueId="$blockingNodeId" 2>&1 | Out-String
  if ($LASTEXITCODE -eq 0) {
    Write-Output "Linked blocking issue #$blockingIssue -> issue #$Issue"
    continue
  }

  if ($result -match "already|duplicate|exists") {
    Write-Output "Skipped blocking issue #$blockingIssue (already linked to #$Issue)"
    continue
  }

  Write-Error "Failed to add blocking issue #$blockingIssue -> issue #$Issue. This repository/API combination may not support issue dependency mutation, or your token lacks permissions. Original error: $($result.Trim())"
  exit $LASTEXITCODE
}

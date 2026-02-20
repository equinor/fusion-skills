param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [ValidateRange(1, 100)]
  [int]$IssueLimit = 10
)

Write-Output "== Repository =="
$repoView = gh repo view $Repo --json nameWithOwner,description,defaultBranchRef,url,isPrivate | ConvertFrom-Json
Write-Output ("repo={0} | private={1} | defaultBranch={2} | url={3} | description={4}" -f $repoView.nameWithOwner, $repoView.isPrivate, $repoView.defaultBranchRef.name, $repoView.url, $repoView.description)

Write-Output ""
Write-Output "== Labels (first 100) =="
$labels = gh label list --repo $Repo --limit 100 --json name,description,color | ConvertFrom-Json
foreach ($label in $labels) {
  Write-Output ("{0} | color={1} | {2}" -f $label.name, $label.color, $label.description)
}

Write-Output ""
Write-Output "== Issue templates =="
try {
  $templates = gh api "repos/$Repo/contents/.github/ISSUE_TEMPLATE" | ConvertFrom-Json
  foreach ($template in $templates) {
    Write-Output ("{0} | {1}" -f $template.name, $template.path)
  }
}
catch {
  Write-Output "No .github/ISSUE_TEMPLATE directory found"
}

Write-Output ""
Write-Output "== Recent open issues =="
$issues = gh issue list --repo $Repo --state open --limit $IssueLimit --json number,title,labels,url,updatedAt | ConvertFrom-Json
foreach ($issue in $issues) {
  $labelsText = ($issue.labels | ForEach-Object { $_.name }) -join ","
  Write-Output "#$($issue.number) $($issue.title) | labels=$labelsText | updated=$($issue.updatedAt) | $($issue.url)"
}
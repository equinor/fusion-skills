param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [ValidateSet("open", "closed", "all")]
  [string]$State = "open",

  [ValidateRange(1, 200)]
  [int]$Limit = 20
)

$items = gh issue list `
  --repo $Repo `
  --state $State `
  --limit $Limit `
  --json number,title,state,updatedAt,labels,author,url | ConvertFrom-Json

foreach ($item in $items) {
  $labels = ($item.labels | ForEach-Object { $_.name }) -join ","
  Write-Output "#$($item.number) [$($item.state)] $($item.title) | labels=$labels | updated=$($item.updatedAt) | author=$($item.author.login) | $($item.url)"
}
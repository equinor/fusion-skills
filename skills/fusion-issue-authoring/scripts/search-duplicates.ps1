param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [Parameter(Mandatory = $true)]
  [string]$Query,

  [ValidateSet("open", "closed", "all")]
  [string]$State = "all",

  [ValidateRange(1, 200)]
  [int]$Limit = 20
)

$items = gh search issues `
  --repo $Repo `
  --state $State `
  --limit $Limit `
  $Query `
  --json number,title,state,updatedAt,labels,repository,url | ConvertFrom-Json

foreach ($item in $items) {
  $labels = ($item.labels | ForEach-Object { $_.name }) -join ","
  Write-Output "#$($item.number) [$($item.state)] $($item.title) | labels=$labels | updated=$($item.updatedAt) | $($item.repository.owner.login)/$($item.repository.name) | $($item.url)"
}
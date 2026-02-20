param(
  [Parameter(Mandatory = $true)]
  [string]$Repo,

  [ValidateRange(1, 1000)]
  [int]$Limit = 100
)

$labels = gh label list `
  --repo $Repo `
  --limit $Limit `
  --json name,description,color | ConvertFrom-Json

foreach ($label in $labels) {
  $description = if ($null -eq $label.description) { "" } else { $label.description }
  Write-Output "$($label.name) | color=$($label.color) | $description"
}

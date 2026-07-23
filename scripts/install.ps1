#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Copies selected skills from this repo into a target project's skills
  directory. Select by exact name, by category, or copy everything.

.EXAMPLE
  ./install.ps1 -Target C:\projects\my-app -All

.EXAMPLE
  ./install.ps1 -Target ./my-app -Name key-behavior-definer,comb-barrier-decomposer

.EXAMPLE
  ./install.ps1 -Target ./my-app -Category diagnosis,behavior-definition

.EXAMPLE
  ./install.ps1 -List
#>
param(
  [string]$Target,
  [switch]$All,
  [string[]]$Name,
  [string[]]$Category,
  [switch]$List
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$SkillsSrc = Join-Path $RepoRoot "skills"

function Get-SkillField {
  param([string]$SkillMdPath, [string]$Field)
  $line = Get-Content $SkillMdPath | Where-Object { $_ -match "^$Field`:\s*(.+)$" } | Select-Object -First 1
  if ($line -match "^$Field`:\s*(.+)$") { return $Matches[1].Trim() }
  return ""
}

function Show-SkillList {
  $rows = Get-ChildItem -Path $SkillsSrc -Directory | ForEach-Object {
    $md = Join-Path $_.FullName "SKILL.md"
    if (Test-Path $md) {
      [PSCustomObject]@{
        Name     = $_.Name
        Category = Get-SkillField -SkillMdPath $md -Field "category"
        Title    = Get-SkillField -SkillMdPath $md -Field "title"
      }
    }
  }
  $rows | Format-Table -AutoSize
}

if ($List) {
  Show-SkillList
  exit 0
}

if (-not $All -and -not $Name -and -not $Category) {
  Write-Error "Specify -All, -Name, or -Category (or use -List)."
  exit 1
}

if (-not $Target) {
  Write-Error "-Target <dir> is required."
  exit 1
}

$Dest = Join-Path $Target "skills"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null

$ToInstall = @()

if ($All) {
  $ToInstall = Get-ChildItem -Path $SkillsSrc -Directory | ForEach-Object { $_.Name }
}
elseif ($Name) {
  foreach ($n in $Name) {
    $skillDir = Join-Path $SkillsSrc $n
    if (-not (Test-Path $skillDir)) {
      Write-Error "No skill named '$n' in $SkillsSrc"
      exit 1
    }
    $ToInstall += $n
  }
}
elseif ($Category) {
  foreach ($dir in Get-ChildItem -Path $SkillsSrc -Directory) {
    $md = Join-Path $dir.FullName "SKILL.md"
    if (-not (Test-Path $md)) { continue }
    $cat = Get-SkillField -SkillMdPath $md -Field "category"
    if ($Category -contains $cat) {
      $ToInstall += $dir.Name
    }
  }
  if ($ToInstall.Count -eq 0) {
    Write-Warning "No skills matched category selector: $($Category -join ',')"
  }
}

foreach ($name in $ToInstall) {
  $src = Join-Path $SkillsSrc $name
  $dst = Join-Path $Dest $name
  if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
  Copy-Item -Recurse -Path $src -Destination $dst
  Write-Host "installed: $name -> $dst"
}

Write-Host "$($ToInstall.Count) skill(s) installed into $Dest"

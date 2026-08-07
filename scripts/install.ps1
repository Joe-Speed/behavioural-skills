#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Copies selected skills from this repo into a target project's skills
  directory. Select by exact name, by category, or copy everything.

.EXAMPLE
  ./install.ps1 -Target C:\projects\my-app -All

.EXAMPLE
  ./install.ps1 -Target ./my-app -Name key-behaviour-definer,comb-barrier-decomposer

.EXAMPLE
  ./install.ps1 -Target ./my-app -Category diagnosis,behaviour-definition

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

$RepoZipUrl = "https://github.com/Joe-Speed/behavioural-skills/archive/refs/heads/main.zip"

function Remove-TmpDir {
  if ($script:TmpDir -and (Test-Path $script:TmpDir)) { Remove-Item -Recurse -Force $script:TmpDir }
}

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

if (-not $List) {
  if (-not $All -and -not $Name -and -not $Category) {
    Write-Error "Specify -All, -Name, or -Category (or use -List)."
    exit 1
  }
  if (-not $Target) {
    Write-Error "-Target <dir> is required."
    exit 1
  }
}

# When run from a repo checkout, copy skills straight from it. When the
# script was downloaded standalone (iwr ... -OutFile install.ps1) there is no
# checkout next to it, so fetch the repo zip into a temp dir and copy from
# that instead. taxonomy.yaml alongside skills/ confirms it's *this* repo, not
# an unrelated sibling directory named skills. The temp dir is always removed
# by the finally block, including on the error exits below.
$RepoRoot = Split-Path -Parent $PSScriptRoot
$SkillsSrc = Join-Path $RepoRoot "skills"
$TmpDir = $null

try {
  if (-not ((Test-Path $SkillsSrc) -and (Test-Path (Join-Path $RepoRoot "schema/taxonomy.yaml")))) {
    Write-Host "Fetching skills from $RepoZipUrl ..."
    $TmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ("behavioural-skills-" + [System.IO.Path]::GetRandomFileName())
    New-Item -ItemType Directory -Path $TmpDir | Out-Null
    $zipPath = Join-Path $TmpDir "repo.zip"
    Invoke-WebRequest -UseBasicParsing -Uri $RepoZipUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $TmpDir
    $SkillsSrc = Join-Path $TmpDir "behavioural-skills-main/skills"
    if (-not (Test-Path $SkillsSrc)) {
      throw "Could not fetch skills from $RepoZipUrl"
    }
  }

  if ($List) {
    Show-SkillList
    exit 0
  }

  $Dest = Join-Path $Target "skills"
  New-Item -ItemType Directory -Force -Path $Dest | Out-Null

  $ToInstall = @()

  if ($All) {
    $ToInstall = Get-ChildItem -Path $SkillsSrc -Directory | ForEach-Object { $_.Name }
  }
  elseif ($Name) {
    foreach ($n in $Name) {
      if ([string]::IsNullOrWhiteSpace($n) -or $n -match '[\\/]' -or $n -match '\.\.') {
        throw "Invalid skill name '$n' — names cannot be empty or contain path separators or '..'"
      }
      $skillDir = Join-Path $SkillsSrc $n
      if (-not (Test-Path $skillDir)) {
        throw "No skill named '$n' in $SkillsSrc"
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
}
finally {
  Remove-TmpDir
}

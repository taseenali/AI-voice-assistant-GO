# Compile all MedVoice LaTeX documents to PDF
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

$docs = @(
    "00-master-document",
    "01-vapi-integration",
    "02-component-inventory",
    "03-external-resources",
    "04-project-roadmap",
    "05-gtm-strategy",
    "06-product-architecture-guide",
    "07-what-to-buy"
)

foreach ($doc in $docs) {
    Write-Host "Compiling $doc.tex ..."
    pdflatex -interaction=nonstopmode "$doc.tex" | Out-Null
    pdflatex -interaction=nonstopmode "$doc.tex" | Out-Null
    if (Test-Path "$doc.pdf") {
        Write-Host "  -> $doc.pdf OK"
    } else {
        Write-Warning "  -> $doc.pdf FAILED (is pdflatex installed?)"
    }
}

Write-Host "`nDone. PDFs in $dir"

# === START LOCALHOST SERVER ===
$port = 8080
$folder = "C:\Users\alexa\Desktop\site\en"  # serve files from current folder
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")
$listener.Start()
Write-Host "Server running at http://$(hostname):$port/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $filePath = Join-Path $folder $request.Url.LocalPath.TrimStart('/')
    if ((Test-Path $filePath) -and !(Test-Path $filePath -PathType Container)) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = "text/html"
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $error = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
        $response.OutputStream.Write($error, 0, $error.Length)
    }
    $response.OutputStream.Close()
}

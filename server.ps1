$root = $PSScriptRoot
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, 4173)
$listener.Start()

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".jpeg" = "image/jpeg"
  ".jpg"  = "image/jpeg"
  ".png"  = "image/png"
  ".svg"  = "image/svg+xml"
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  $stream = $client.GetStream()
  $stream.ReadTimeout = 3000
  $stream.WriteTimeout = 10000
  $reader = [System.IO.StreamReader]::new($stream)
  $requestLine = $reader.ReadLine()

  if (!$requestLine) {
    $client.Close()
    continue
  }

  $requestPath = $requestLine.Split(" ")[1].Split("?")[0]
  $path = [Uri]::UnescapeDataString($requestPath.TrimStart("/"))

  while ($true) {
    $headerLine = $reader.ReadLine()
    if ([string]::IsNullOrEmpty($headerLine)) {
      break
    }
  }

  if ([string]::IsNullOrWhiteSpace($path)) {
    $path = "index.html"
  }

  $file = Join-Path $root $path
  $resolvedRoot = [System.IO.Path]::GetFullPath($root)
  $resolvedFile = [System.IO.Path]::GetFullPath($file)

  if (!$resolvedFile.StartsWith($resolvedRoot) -or !(Test-Path -LiteralPath $resolvedFile -PathType Leaf)) {
    $response = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n")
    $stream.Write($response, 0, $response.Length)
    $stream.Flush()
    $client.Close()
    continue
  }

  $extension = [System.IO.Path]::GetExtension($resolvedFile).ToLowerInvariant()
  $contentType = $mimeTypes[$extension]
  if (!$contentType) {
    $contentType = "application/octet-stream"
  }
  $bytes = [System.IO.File]::ReadAllBytes($resolvedFile)
  $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n")
  $stream.Write($header, 0, $header.Length)
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Flush()
  $client.Close()
}

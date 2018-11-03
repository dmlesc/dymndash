Param( [string]$config )
$sql = Get-Content "conf\$config" | ConvertFrom-Json

$ErrorActionPreference = "Stop"

$server = $sql.server
$db = $sql.db
$select_field = $sql.select_field
$table = $sql.table
$where_field = $sql.where_field

$query = "SELECT $select_field FROM $table WHERE $where_field IS NOT NULL"

$Conn = New-Object System.Data.SqlClient.SqlConnection
$Conn.ConnectionString = "Server=$server; Database=$db; Integrated Security=True; Encrypt=True; TrustServerCertificate=True"
$Cmd = New-Object System.Data.SqlClient.SqlCommand
$Cmd.CommandText = $query
$Cmd.Connection = $Conn
$DataAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
$DataAdapter.SelectCommand = $Cmd
$DataSet = New-Object System.Data.DataSet
$rowCount = $DataAdapter.Fill($DataSet)

$DataSet.Tables[0] | ConvertTo-Csv -NoTypeInformation | ForEach-Object { $_ -Replace '"', ''} | Out-File "result.csv" -Force -Encoding ascii
$content = Get-Content "result.csv"
[system.io.file]::WriteAllText("$PSScriptRoot\result.csv", $content)
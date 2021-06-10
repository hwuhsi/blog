---
title: "powershell language"
---



```powershell
#user created
$a = "hello"
$Processes = Get-Process

# automatic variables
$PSHOME 

# preference variabes
$MaximumHistoryCount
```

to delete the `value` of a variable

```powershell
Clear-Variable -Name MyVariable
# same as
$MyVariable = $null
```

to delete a variable

```powershell
Remove-Variable -Name MyVariable
Remove-Item -Path Variable:\MyVariable
```



## Single-Quoto and Double-Quoto

```powershell
'Use the $PROFILE variable.'
```


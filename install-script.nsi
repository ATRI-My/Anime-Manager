; NSIS 安装脚本 - 动漫管理工具
Unicode true
Name "动漫管理工具"
OutFile "dist\Anime-Manager-Installer.exe"
InstallDir "$PROGRAMFILES\Anime Manager"
RequestExecutionLevel admin

; 界面设置
!include "MUI2.nsh"

!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_ABORTWARNING

; 安装页面
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; 卸载页面
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; 语言设置
!insertmacro MUI_LANGUAGE "SimpChinese"

Section "主程序"
  SetOutPath "$INSTDIR"
  
  ; 复制文件
  File /r "dist\win-unpacked\*"
  
  ; 创建开始菜单快捷方式
  CreateDirectory "$SMPROGRAMS\动漫管理工具"
  CreateShortcut "$SMPROGRAMS\动漫管理工具\动漫管理工具.lnk" "$INSTDIR\Anime Manager.exe"
  CreateShortcut "$SMPROGRAMS\动漫管理工具\卸载.lnk" "$INSTDIR\Uninstall.exe"
  
  ; 创建桌面快捷方式
  CreateShortcut "$DESKTOP\动漫管理工具.lnk" "$INSTDIR\Anime Manager.exe"
  
  ; 写入卸载信息
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager" \
                   "DisplayName" "动漫管理工具"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager" \
                   "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager" \
                   "DisplayIcon" "$INSTDIR\Anime Manager.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager" \
                   "Publisher" "动漫管理工具开发团队"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager" \
                     "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager" \
                     "NoRepair" 1
SectionEnd

Section "Uninstall"
  ; 删除文件
  RMDir /r "$INSTDIR"
  
  ; 删除开始菜单快捷方式
  Delete "$SMPROGRAMS\动漫管理工具\动漫管理工具.lnk"
  Delete "$SMPROGRAMS\动漫管理工具\卸载.lnk"
  RMDir "$SMPROGRAMS\动漫管理工具"
  
  ; 删除桌面快捷方式
  Delete "$DESKTOP\动漫管理工具.lnk"
  
  ; 删除注册表信息
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AnimeManager"
SectionEnd
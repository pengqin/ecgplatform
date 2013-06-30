ftp -v -n 182.18.31.105 << EOF
user ainia ppainia
binary
PASV
ls
put web.war web.war
close
bye
!
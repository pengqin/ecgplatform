ftp -v -n 182.18.31.105 << EOF
user ainia ppainia
binary
passive
put web.war web.war
close
bye
!
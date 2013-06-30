 !/bin/bash 
ftp -v -n 182.18.31.105 << EOF
user ainia ppainia
binary
cd /opt/jetty7/webapps
lcd /home/travis/build/hopesfish/ecgplatform/web/target
prompt
put web.war web.war
close
bye
!
ftp -inv 115.28.41.123 <<EOF
USER ainia 
PASS ainia
CWD /
TYPE I
PASV
STOR ainia.war
bye
!
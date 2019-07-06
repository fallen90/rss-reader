#!/bin/sh

SERVICE_FILE_DEST=/lib/systemd/system/rss_reader.service;
SERVICE_FILE_SRC=./rss-reader.service

if [ "$EUID" -ne 0 ]
  then echo "Please run the file as root user."
  exit
fi

ln -s $PWD/rss-reader /usr/bin/rss_reader

cp $SERVICE_FILE_SRC $SERVICE_FILE_DEST

if [ -f "$SERVICE_FILE_DEST" ]; then
  systemctl daemon-reload
  systemctl enable rss_reader
  systemctl start rss_reader
else 
  echo "Failed to install as a service."
fi
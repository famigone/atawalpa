#! /bin/bash

  let nivelAnterior=0

  for((i=0; i<=20000; i++))
  do
     sleep 0.01
     let nivel=$RANDOM%30
     let nivel=$nivel+$nivelAnterior
     let nivelAnterior=$nivel

     mosquitto_pub -h localhost -p 1883 -t "TEMPERATURA/S0001" -m "$nivel"
     
  done

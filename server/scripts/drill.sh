#! /bin/bash

  let nivelAnterior=0

  for((i=0; i<=120; i++))
  do
     sleep 0.9
     let nivel=$RANDOM%20
     let nivel=$nivel+$nivelAnterior
     let nivelAnterior=$nivel
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0013" -m "$nivel"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0009" -m "$nivel"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0011" -m "$nivel"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0006" -m "$nivel"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0008" -m "$nivel"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0004" -m "$nivel"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0002" -m "$nivel"
  done

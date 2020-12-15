#! /bin/bash



  for((i=1; i<=10; i++))
  do
     sleep 0.9
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0002" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0004" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0001" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0003" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0005" -m "$i"
  done

  for((i=0; i<=10; i++))
  do
     sleep 0.9
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0002" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0004" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0001" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0003" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0005" -m "$i"
  done

  for((i=0; i<=10; i++))
  do
     sleep 0.9
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0002" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0004" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0001" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0003" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0005" -m "$i"
  done

  for((i=0; i<=5; i++))
  do
     sleep 0.9
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0002" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0004" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0001" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0003" -m "$i"
     mosquitto_pub -h localhost -p 1883 -t "nivel/S0005" -m "$i"
  done

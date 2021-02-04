<center><img src="https://github.com/famigone/atawalpa/blob/master/public/img/logo128teal.png" /></center>

<b>ATAWALPA</b> is a predictive stack designed to study technological transformation opportunities in small companies. It can be used as an approach to Industry 4.0 approaches, monitoring physical or productive processes and allowing you to experiment with your forecast at N time steps into the future.  

## Telemetry
<b>ATAWALPA</b> solves the telemetry of any physical magnitude that is read through a PLC and sent by MQTT protocol. 

## Forecasting
<b>ATAWALPA</b> offers a deep learning predictive model integrated with telemetry readings. It allows, with a few simple clicks, to test different deep architectures to determine the best options according to the computational capacity and the margin of error allowed by the business rules.

## How does it work?
First, you must register the TAGs you want to listen to. <b>ATAWALPA</b> connects to the MQTT server -which must be installed and running-and subscribes to all the events of the tags created. 

<img src="https://github.com/famigone/atawalpa/blob/master/public/img/telemetria1.png" width="400" />

Then, it is possible to have telemetric reading of the sensor associated to the tag. 

<img src="https://github.com/famigone/atawalpa/blob/master/public/img/telemetria2.png" width="400" />

Once the telemetry readings have generated a relevant data set, <b>ATAWALPA</b> offers the possibility to forecast future sensor readings. To do this, a predictive model is first trained on the collected data. 

<img src="https://github.com/famigone/atawalpa/blob/master/public/img/entrenamiento.png" width="400" />

Once the loss levels are acceptable, the model is validated.

<img src="https://github.com/famigone/atawalpa/blob/master/public/img/validacion.png" width="400" />

Finally, the prediction is performed at the N configured time steps. 

<img src="https://github.com/famigone/atawalpa/blob/master/public/img/prediccion.png" width="400" />

This entire process can be parameterized to reduce or increase the capabilities of the underlying LSTM model. 

<img src="https://github.com/famigone/atawalpa/blob/master/public/img/config2.png" width="400" />

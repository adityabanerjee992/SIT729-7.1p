const mqtt = require('mqtt');

// Define connection options
let options = {
    clientId: 'SimulatorClient',
    keepalive: 60,
    clean: true,
    protocol: 'mqtts', // Using MQTT over TLS
    reconnectPeriod: 1000,
    // Uncomment the lines below if your HiveMQ setup requires authentication:
    username: 'adityabanerjee',
    password: 'India@123',
};

// Connect to the broker
const client = mqtt.connect('mqtts://bd7d3ab75650416abacf31086e1f375b.s1.eu.hivemq.cloud:8883', options);

client.on('connect', () => {
    console.log('Connected to HiveMQ broker');
});

client.on('error', (err) => {
    console.error('Connection error:', err);
});

client.on('reconnect', () => {
    console.log('Attempting to reconnect to HiveMQ broker');
});

client.on('close', () => {
    console.log('Connection to HiveMQ broker closed');
});

class Light {
    constructor(id) {
        this.id = id;
        this.status = "off";
        this.brightness = 100;
        this.color = "#FFFFFF";
    }
    toggle() {
        this.status = this.status === "on" ? "off" : "on";
    }
}

class Switch {
    constructor(id, light) {
        this.id = id;
        this.light = light;
    }
    operate() {
        this.light.toggle();
    }
}

function publishLightStatus(light) {
    const topic = `building/light/${light.id}`; 
    const message = JSON.stringify(light); 
    client.publish(topic, message);
}

const lights = [];
const switches = [];
const numberOfLights = 10;

for (let i = 0; i < numberOfLights; i++) {
    const light = new Light(i);
    const lightSwitch = new Switch(i, light);
    lights.push(light);
    switches.push(lightSwitch);
}

// Simulate random light toggling every second
setInterval(() => {
    const randomSwitch = switches[Math.floor(Math.random() * switches.length)];
    randomSwitch.operate();
    publishLightStatus(randomSwitch.light);
}, 1000);

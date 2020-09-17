# zerospy2ha
zerospy2ha is a simple webhook handler that accepts a trigger from ZeroSpy and passes the state of charge of my Zero Motorcycle's battery to a Home Assistant entity.

I wanted to be able to trigger events and notifications about my battery charge level. Since my Zero FXS doesn't have the Cypher III platform on it, I can't get this information from the cloud. I use an old cell phone in the garage which connects to my motorcycle over bluetooth with the ZeroSpy app. ZeroSpy has a trigger set up to report the state of charge at every perentage to zerospy2ha running on an internal docker server. zerospy2ha then reformulates the update into a Home Assistant compatible API call.

### Requirements
* ZeroSpy - https://play.google.com/store/apps/details?id=com.bsc101.zerospy
* Docker - https://www.docker.com
* Home Assistant - https://www.home-assistant.io

### Setup
1. Home Assitant
    1. Navigate to your user profile by clicking on your username in the left navigation panel
    1. Go to the 'Long-Lived Access Tokens' section and create a new token
    1. Give it a name and click OK
    1. Copy the token string
    1. HA will automatically create a sensor once the first SOC is POSTed to the API
1. Docker
    1. Edit `index.js` and configure the options const to align with your Home Assistant setup
    1. Build the container: `docker build -t patfreeman/zerospy2ha .`
    1. Run the container: `docker run -d --restart=unless-stopped -p 8080:8080 --name zerospy2ha patfreeman/zerospy2ha`
1. ZeroSpy
    1. Once configured to auto-connect to your bike
    1. Click the motorcycle logo in the top bar to get to the Triggers menu
    1. Add a trigger with the + sign
    1. I use 0% + n x 1%, to get a trigger for every percentage of charge change
    1. Set the URL to: `http://<your_docker_server>:8080/?soc=%SOC%`

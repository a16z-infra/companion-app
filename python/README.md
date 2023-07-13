

# Python Companion

The following instructions should get you up and running with a fully functional, local deployment of four AIs to chat with. Note that the companions running on Vicuna (Rosie and Lucky) will take more time to respond as we've not dealt with the cold start problem. So you may have to wait around a bit :)


## Quick start

1. Set up your environment

```commandline
pip install -r requirements.txt
```

3. Initialize your companions

```commandline
python init_companions.py
```


## Upgrades

### Modifying your companion logic

You can modify your companion by editing the `src/api.py`. Here are a few interesting ideas:

* Add tools
* Modify the logic of your agent
* Add endpoints 
* Add webhooks

This is a separate step from adding personality and backstory -- those are done elsewhere.

### Connecting to Telegram 

You can connect your chatbot to Telegram by providing a bot token





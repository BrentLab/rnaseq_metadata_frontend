## Useful Links
[set up django with postgres and gunicorn on ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04)  
[maybe a better way of doing what I suggest below](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

## create a AWS Ubuntu 20.04 EC2 instance

1. Log into [amazon AWS](https://aws.amazon.com)

2. Find the 'EC2' service somewhere -- there are multiple locations. One spot it will always be is in the __service menu__ to the top left of your screen  

![](aws_service_menu.png)

3. Open the 'Instances' page  

![](aws_ec2_dashboard.png)

4. Launch a new isntance

![](launch_new_instance.png)

5. Choose Ubuntu 20.04

![](choose_ubuntu.png)

6. Select the free 'free tier eligible' instance type (if you're outside of your free window, choose whatever is most appropriate) and click "Review and Launch"

![](choose_free_tier.png)

7. The next page will just be a review of your choices thus far. Click "Configure Security Group"

![](click_edit_security_group.png)

8. Click "Add Rule", from the dropdown select "HTTP". The default that is filled in Source should be correct, but make sure that it is the same as the image below. Click "Review and Launch" when done.

![](add_http_rule.png)

9. You will be directed back to the overview page again. Click "Launch".

10. You now need to wait until the instance is running, which takes a few minutes. Once it is running, click the 'instance ID' link

![](open_new_instance.png)

11. Click 'connect', go to the SSH client tab (should be open by default), and follow the instructions to connect through your terminal. Note: best practice would be to create a user at this point. You can then add a ssh_key and make the login easier. Follow instructions [here to create a user with sudo permission](https://classes.engineering.wustl.edu/cse330/index.php?title=Linux#User_Management) and [here to add your ssh_key](https://classes.engineering.wustl.edu/cse330/index.php?title=SSH#SSH_Configuration)


## On your instance instance

1. update your system, and install nginx

```
sudo apt update
sudo apt upgrade
sudo apt install nginx
```
_note: if apache is already running, you'll need to disable it at this point (not applicable to AWS, just a note in case you're using a different ubuntu system)_

2. git clone this repository, follow the instructions in the [README](index.html) regarding the environmental variable configuration file, and then run `npm build`. Note that you can put the 'build' directory anywhere on your system. I have lazily set this up in the server
script below to be served from the root user, from the home directory. You shouldn't do this, though. Make a new user who is not root. A commonly used directory for serving files is `/var/www`.

3. create a configuration file that will direct traffic to wherever it is you want that traffic to go

```
# take a look at the sites available directory
/etc/nginx/sites-available
# then make a new configuration. your_site_name might be something like "yeast_database_frontend"
sudo vim /etc/nginx/sites-available/your_site_name
```

4. Adapt the following to your purposes
    - make sure that server_name is the ip for your instance (found on the instance detail page on AWS)
    - make sure the paths are correct for your specific use case

```
server {
	listen 80;
	listen [::]:80;

	server_name 18.116.65.9;

	location / {
            root /home/ubuntu/creativeproject-module7-485709/frontend/build;
            index index.html;
	    try_files $uri $uri/ =404;
	}

        location /docs/ {
            root /home/ubuntu/creativeproject-module7-485709/frontend;
	    index index.html;
        }
}
```
5. symlink this to the sites-enabled directory
```
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
```
6. Test your Nginx configuration
```
sudo nginx -t
```
7. Resolve errors if you need to. Otherwise, restart Nginx
```
sudo system nginx restart
```

At this point the server should be running and serving as you directed it to serve. However, below lists some complications. A better list of complications is [in the 'troubleshooting' section here](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04)


## complications
 - ensuring that your ports are configured correctly if you're not using AWS
 - configuring the firewall ([ufw](https://phoenixnap.com/kb/how-to-enable-disable-firewall-ubuntu))
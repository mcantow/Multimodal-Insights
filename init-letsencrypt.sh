# !/bin/bash
#  THIS script downloads certificates for you production instance
#  MAKE sure to add you domain name(s) to the variable in line 11
#     domains should list your dns registered name first, others after, (ex www.primaryDomainName)
#  ALSO make sure your ports 80 is open, for example not running a container
  # docker compose down should work 

################################################################################
# PUT YOUR DOMAIN NAMES IN #####################################################
################################################################################
domains=(multimodalinsights.com www.multimodalinsights.com) # <- HERE          #
################################################################################
data_path="./data/certbot"

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi
echo "### Creating certificate for $domains ..."

# install 
apt-get update
sudo apt-get install certbot
apt-get install python3-certbot-nginx

# nginx load
nginx -t && nginx -s reload

# Prepare the certbot command with -d arguments
certbot_command="sudo certbot --nginx"

# Iterate over the domain names and add them as -d arguments
for domain in "${domains[@]}"; do
  certbot_command+=" -d $domain"
done

# Execute the certbot command
eval "$certbot_command"

cp -Lr /etc/letsencrypt/live $data_path/conf/live
update ip
=========

A small script to update ip.

## Usage
```bash
npm start ip_name
```

## crontab
```
*/10 * * * * cd /project/path && /path/to/node index.js ip_name >> /project/logs/`date '+\%Y.\%m'`.log
```


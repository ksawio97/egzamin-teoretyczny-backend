## Requirments
 - Mongodb
 - nodejs
## Debug
DEBUG=myapp:* npm start

## Easy add to db media (u need to be in dir)
```
for filename in *; do mongofiles -d egzaminteoretycznydb put ${filename}; done
```
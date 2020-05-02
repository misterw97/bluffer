# appv2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Redis docker container

```bash
docker run --name bluffer-redis -d -v ${pwd}/data:/data -p 6379:6379 redis redis-server --appendonly yes
```
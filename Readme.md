While prepraring this object I have learned:
- Cookies: When I set cookies into the browser . but it does not carry with api request. because of while I am assigning ip (not localhost) and set secure true in http request.(but it's works on localhost (127.0.0.1 will also not work)). to resolve this issue I have set secure false. then it works.

- if services has common ingress then not necessarily need to add ip for communication (ex: 172.12.12.3/api/v1 -> /api/v1 )

- how can we pass env dynamically while nginx is serving react application

To run this project in kubernetes, some requriements:
    - metallb
    - helm
    - ingress controller

first install ingress nginx controller:
```sh
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace # if you change the namespace then you have to change the namespace name in mainfests too (k8s-deployment directory)
```

then run
```sh
kubectl apply -f k8s-deployment
```



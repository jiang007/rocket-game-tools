module.exports = cc.Class({
    name: 'HttpRequest',
    properties: {
        onTimeout: null,
        onSuccess: null,
        onError: null,

        timeoutDelay: 0,
        maxRequestCount: 0,

        _requestEntity: null,
        _xhr: null,
    },

    ctor(timeoutDelay = 8000, maxRequestCount = 3) {
        this.timeoutDelay = timeoutDelay;
        this.maxRequestCount = maxRequestCount;
    },

    send(method, url, data) {
        if (!this._requestEntity) {
            this._requestEntity = {
                count: 0,
                method: method,
                url: url,
                data: data
            }
        }

        this._xhr = cc.loader.getXMLHttpRequest();
        this._xhr.open(method, url, true);
        this._xhr.timeout = this.timeoutDelay;
        this._xhr.ontimeout = () => {
            if (!this._requestAgain()) {
                if (this.onTimeout) {
                    this.onTimeout();
                }
            }
        };
        this._xhr.onreadystatechange = () => {
            if (this._xhr.readyState === 4) {
                if (this._xhr.status >= 200 && this._xhr.status < 300) {
                    if (this.onSuccess) {
                        this.onSuccess(this._xhr.response);
                    }
                } else if (this._xhr.status >= 400 || this._xhr.status === 0) {
                    if (!this._requestAgain()) {
                        if (this.onError) {
                            this.onError();
                        }
                    }
                }
            }
        }
        if (data) {
            this._xhr.send(data);
        } else {
            this._xhr.send();
        }
    },

    _requestAgain() {
        if (++this._requestEntity.count <= this.maxRequestCount) {
            this.send(this._requestEntity.method, this._requestEntity.url, this._requestEntity.data);
            cc.log('request again:' + this._requestEntity.count);
            return true;
        }
        return false;
    }


});

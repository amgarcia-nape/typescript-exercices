{
  type OnClickArgs = {
    target: {
      value: string;
    };
  };

  type OnError = {
    message: string;
    error: Error;
  };

  type OnData = {
    currency: string;
    exchangeRate: number;
  };

  class EventEmitter {
    // TODO: Bonus part 3: type more precisely
    private listeners = new Map<any, Set<any>>();

    // TODO Part 1: type correctly
    fire(event: any, arg: any) {
      this.listeners.get(event)?.forEach((listener) => listener(arg));
    }

    // TODO Part 1: type correctly
    on(event: any, callback: any) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event)!.add(callback);
      return () => {
        this.listeners.get(event)?.delete(callback);
      };
    }
  }

  /*
   * PART 1 TESTS
   *
   * Correctly type the methods `on` and `fire` of `EventEmitter` above
   */
  // domListener handles events 'click' (OnClickArgs) and 'error' (OnError)
  // TODO: pass a generic argument to EventEmitter describing the possible events
  const domListener = new EventEmitter();

  // serverListener handles events 'data' (OnData) and 'error' (OnError)
  // TODO: pass a generic argument to EventEmitter describing the possible events
  const serverListener = new EventEmitter();

  // These statements should all succeed (without changing them)
  domListener.fire("click", { target: { value: "test " } });
  domListener.fire("error", {
    message: "Oops",
    error: new Error("Something went painfully wrong"),
  });

  serverListener.fire("data", { currency: "EUR", exchangeRate: 1.12 });

  serverListener.on("data", ({ currency, exchangeRate }) => {
    console.log(`1 ${currency} buys ${1 / exchangeRate} GBP now`);
  });

  // These statements should all fail (without changing them)
  domListener.fire("data", { currency: "EUR", exchangeRate: 1.12 }); // domListener has no data event
  serverListener.on("data", true); // true is not an event handler

  serverListener.on("data", ({ currency, exchangeRate }) => {
    console.log(`1 ${currency * 2} buys ${1 / exchangeRate} GBP now`); // currency is a string so cannot be multiplied
  });

  serverListener.on("error", (details) => {
    console.log(details.currency); // details is of type OnError, not OnData
  });

  /**
   * PART 2 TEST
   *
   * Make sure that arguments passed to the listeners are treated deeply immutable. Build a recursive type for that.
   */
  // These statements should fail (without changing them)
  serverListener.on("data", (details) => {
    details.currency = "USD"; // mutations should be forbidden!
  });

  domListener.on("click", (event) => {
    event.target.value = "Forbidden"; // deep mutations should be forbidden!
  });

  /**
   * PART 3
   *
   * No new tests, but make sure EventEmitter.listeners field is typed more precisely
   */
}

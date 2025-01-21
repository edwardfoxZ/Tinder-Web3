const Tinder = artifacts.require("Tinder");

contract("Tinder", (accounts) => {
  let instance;
  const [user1, user2] = accounts;

  beforeEach(async () => {
    instance = await Tinder.new();
  });

  it("should register a user", async () => {
    await instance.register(25, 1, "Alice", "New York", "pic1.jpg", {
      from: user1,
    });

    const user = await instance.getUser(user1); // Use the getter function
    assert.equal(user.name, "Alice", "User name does not match");
    assert.equal(user.city, "New York", "City does not match");
    assert.equal(user.age, 25, "Age does not match");
    assert.equal(user.gender, 1, "Gender does not match");
    assert.equal(user.picUrl, "pic1.jpg", "Profile picture URL does not match");
  });

  it("should allow swiping", async () => {
    await instance.register(25, 1, "Alice", "New York", "pic1.jpg", {
      from: user1,
    });
    await instance.register(26, 0, "Bob", "New York", "pic2.jpg", {
      from: user2,
    });

    const tx = await instance.swipe(user2, 1, { from: user1 }); // User1 likes User2
    const swipeStatus = await instance.getSwipeStatus(user1, user2); // Use the getter function

    assert.equal(swipeStatus.toNumber(), 1, "Swipe status does not match");
    assert(tx.logs[0].event === "Swiped", "Swiped event not emitted");
    assert.equal(
      tx.logs[0].args.from,
      user1,
      "Swiped event 'from' address mismatch"
    );
    assert.equal(
      tx.logs[0].args.to,
      user2,
      "Swiped event 'to' address mismatch"
    );
    assert.equal(
      tx.logs[0].args.status.toNumber(),
      1,
      "Swiped status mismatch"
    );
  });

  it("should emit a Matched event when both users like each other", async () => {
    await instance.register(25, 1, "Alice", "New York", "pic1.jpg", {
      from: user1,
    });
    await instance.register(26, 0, "Bob", "New York", "pic2.jpg", {
      from: user2,
    });

    await instance.swipe(user2, 1, { from: user1 });
    const tx = await instance.swipe(user1, 1, { from: user2 }); // Mutual like

    assert(tx.logs[0].event === "Matched", "Matched event not emitted");
    assert.equal(
      tx.logs[0].args.from,
      user2,
      "Matched event 'from' address mismatch"
    );
    assert.equal(
      tx.logs[0].args.to,
      user1,
      "Matched event 'to' address mismatch"
    );
  });

  it("should allow sending a message between matched users", async () => {
    await instance.register(25, 1, "Alice", "New York", "pic1.jpg", {
      from: user1,
    });
    await instance.register(26, 0, "Bob", "New York", "pic2.jpg", {
      from: user2,
    });

    await instance.swipe(user2, 1, { from: user1 });
    await instance.swipe(user1, 1, { from: user2 }); // Mutual like

    const tx = await instance.message(user2, "Hello Bob!", { from: user1 });

    assert(tx.logs[0].event === "sendMessage", "sendMessage event not emitted");
    assert.equal(
      tx.logs[0].args.from,
      user1,
      "sendMessage 'from' address mismatch"
    );
    assert.equal(
      tx.logs[0].args.to,
      user2,
      "sendMessage 'to' address mismatch"
    );
    assert.equal(
      tx.logs[0].args.content,
      "Hello Bob!",
      "Message content mismatch"
    );
  });
});

const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);
const sandbox = sinon.createSandbox();

describe("Permissions", function() {
  let nativeInterface;
  let eventEmitter;

  beforeEach(function beforeEach() {
    nativeInterface = sandbox.stub(jet.module._nativeInterface);
    eventEmitter = sandbox.stub(new jet.rn.NativeEventEmitter(nativeInterface));
    jet.module._configureHelpers(nativeInterface, eventEmitter);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("RNLocation.getLocationServicesStatus", function() {
    describe("iOS", function() {
      before(function() {
        if (jet.rn.Platform.OS !== "ios") {
          this.skip();
        }
      });

      const testLocationPermissions = async function(
        simulatorStatus,
        checkStatus,
        expectedValue
      ) {
        await device.launchApp({
          newInstance: true,
          permissions: { serviceStatus: simulatorStatus }
        });

        const result = await jet.module.checkPermission(checkStatus);

        expect(result).to.equal(expectedValue);
      };

      describe("unknown", function() {
        it("should return the correct value when error getting status", async function() {
          await testLocationPermissions("UKNOWN", {}, false);
        });

        it("should return the correct value when error getting status", async function() {
          await testLocationPermissions(null, {}, false);
        });

        it("should return the correct value when off", async function() {
          await testLocationPermissions(
            "false",
            { serviceStatus: "off" },
            false
          );
        });

        it("should return the correct value when foreground allowed", async function() {
          await testLocationPermissions("on", { serviceStatus: "on" }, true);
        });

        it("should return the correct value when always allowed", async function() {
          await testLocationPermissions("on", { serviceStatus: "off" }, false);
        });

        it("should return the correct value when always allowed", async function() {
          await testLocationPermissions("off", { serviceStatus: "on" }, false);
        });
      });
    });
  });
});

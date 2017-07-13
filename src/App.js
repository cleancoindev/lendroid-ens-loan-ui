// Front-end components
import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// Smart contracts
import MarketContract from './utils/contracts/Market.json'
import getWeb3 from './utils/web3/getWeb3'
// Old CSS
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loanManagerContractAddress: '0xf437f3010633136b507241ff0c112edc3b3de974',
      userAccount: null,
      web3: null,
      ens: null,
      loanManager: null,
      isLoanManagerActive: null,
      interestRatePerDay: null,
      maxLoanPeriodDays: null,
      lendableLevel: null,
      collateralManagerAddress: '0x8a580e47c638e0c42d79ab86e90ed78279fe5d1a',
      etherLocked: null,
      loanOffered: null,
      loanPeriod: null,
      isOwner: false,
      deedTransferred: false,
      deedReclaimed: false,
}

    this.dateFromTimestamp = this.dateFromTimestamp.bind(this);
    this.handleEnsNameSubmit = this.handleEnsNameSubmit.bind(this);
    this.handleRequestLoanSubmit = this.handleRequestLoanSubmit.bind(this);
    this.handleTransferDeedSubmit = this.handleTransferDeedSubmit.bind(this);
    this.handleReclaimDeedSubmit = this.handleReclaimDeedSubmit.bind(this);
    this.handleEscapeHatchClaimDeedSubmit = this.handleEscapeHatchClaimDeedSubmit.bind(this);
    this.namehash = this.namehash.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onTabActive = this.onTabActive.bind(this);
  }

  componentWillMount() {

    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  onTabChange(i, value, tab, ev) {
    console.log(arguments);
  }

  onTabActive(tab) {
    console.log(arguments);
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    this.state.web3.eth.getAccounts((error, accounts) => {

      var ensContract = this.state.web3.eth.contract([{constant:!0,inputs:[{name:"node",type:"bytes32"}],name:"resolver",outputs:[{name:"",type:"address"}],payable:!1,type:"function"},{constant:!0,inputs:[{name:"node",type:"bytes32"}],name:"owner",outputs:[{name:"",type:"address"}],payable:!1,type:"function"},{constant:!1,inputs:[{name:"node",type:"bytes32"},{name:"label",type:"bytes32"},{name:"owner",type:"address"}],name:"setSubnodeOwner",outputs:[],payable:!1,type:"function"},{constant:!1,inputs:[{name:"node",type:"bytes32"},{name:"ttl",type:"uint64"}],name:"setTTL",outputs:[],payable:!1,type:"function"},{constant:!0,inputs:[{name:"node",type:"bytes32"}],name:"ttl",outputs:[{name:"",type:"uint64"}],payable:!1,type:"function"},{constant:!1,inputs:[{name:"node",type:"bytes32"},{name:"resolver",type:"address"}],name:"setResolver",outputs:[],payable:!1,type:"function"},{constant:!1,inputs:[{name:"node",type:"bytes32"},{name:"owner",type:"address"}],name:"setOwner",outputs:[],payable:!1,type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"node",type:"bytes32"},{indexed:!1,name:"owner",type:"address"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"node",type:"bytes32"},{indexed:!0,name:"label",type:"bytes32"},{indexed:!1,name:"owner",type:"address"}],name:"NewOwner",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"node",type:"bytes32"},{indexed:!1,name:"resolver",type:"address"}],name:"NewResolver",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"node",type:"bytes32"},{indexed:!1,name:"ttl",type:"uint64"}],name:"NewTTL",type:"event"}]),
        registrarContract = this.state.web3.eth.contract([{ "constant": false, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "releaseDeed", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "getAllowedTime", "outputs": [ { "name": "timestamp", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "unhashedName", "type": "string" } ], "name": "invalidateName", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "hash", "type": "bytes32" }, { "name": "owner", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "salt", "type": "bytes32" } ], "name": "shaBid", "outputs": [ { "name": "sealedBid", "type": "bytes32" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "bidder", "type": "address" }, { "name": "seal", "type": "bytes32" } ], "name": "cancelBid", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "entries", "outputs": [ { "name": "", "type": "uint8" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "ens", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_hash", "type": "bytes32" }, { "name": "_value", "type": "uint256" }, { "name": "_salt", "type": "bytes32" } ], "name": "unsealBid", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "transferRegistrars", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "bytes32" } ], "name": "sealedBids", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "state", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_hash", "type": "bytes32" }, { "name": "newOwner", "type": "address" } ], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_hash", "type": "bytes32" }, { "name": "_timestamp", "type": "uint256" } ], "name": "isAllowed", "outputs": [ { "name": "allowed", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "finalizeAuction", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "registryStarted", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "sealedBid", "type": "bytes32" } ], "name": "newBid", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "labels", "type": "bytes32[]" } ], "name": "eraseNode", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_hashes", "type": "bytes32[]" } ], "name": "startAuctions", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "hash", "type": "bytes32" }, { "name": "deed", "type": "address" }, { "name": "registrationDate", "type": "uint256" } ], "name": "acceptRegistrarTransfer", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_hash", "type": "bytes32" } ], "name": "startAuction", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "rootNode", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "hashes", "type": "bytes32[]" }, { "name": "sealedBid", "type": "bytes32" } ], "name": "startAuctionsAndBid", "outputs": [], "payable": true, "type": "function" }, { "inputs": [ { "name": "_ens", "type": "address" }, { "name": "_rootNode", "type": "bytes32" }, { "name": "_startDate", "type": "uint256" } ], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "hash", "type": "bytes32" }, { "indexed": false, "name": "registrationDate", "type": "uint256" } ], "name": "AuctionStarted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "hash", "type": "bytes32" }, { "indexed": true, "name": "bidder", "type": "address" }, { "indexed": false, "name": "deposit", "type": "uint256" } ], "name": "NewBid", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "hash", "type": "bytes32" }, { "indexed": true, "name": "owner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "status", "type": "uint8" } ], "name": "BidRevealed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "hash", "type": "bytes32" }, { "indexed": true, "name": "owner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "registrationDate", "type": "uint256" } ], "name": "HashRegistered", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "hash", "type": "bytes32" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "HashReleased", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "hash", "type": "bytes32" }, { "indexed": true, "name": "name", "type": "string" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "registrationDate", "type": "uint256" } ], "name": "HashInvalidated", "type": "event" } ]),
        collateralManagerContract = this.state.web3.eth.contract([{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ENSLoanManager","type":"address"}],"name":"changeENSLoanManager","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"encumbered","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ENSLoanManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"},{"name":"_requester","type":"address"}],"name":"unencumberCollateral","outputs":[{"name":"status","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"}],"name":"escapeHatchClaimDeed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"},{"name":"_requester","type":"address"}],"name":"encumberCollateral","outputs":[{"name":"status","type":"bool"},{"name":"deedAddress","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"collateralValue","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"}],"name":"withdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);

      this.setState({
        userAccount: accounts[0],
        loanManager: this.state.web3.eth.contract(MarketContract['abi']).at(this.state.loanManagerContractAddress),
        ens: ensContract.at('0xb766772c58b098d8412143a473aed6bc41c95bde'),
        ethRegistrar: registrarContract.at('0xa5c650649b2a8e3f160035cee17b3c7e94b0805f'),
        collateralManager: collateralManagerContract.at(this.state.collateralManagerAddress)
      });
      
      var _that = this;
      // Populate state from Market deployment
      _that.state.loanManager.interestRatePerDay.call(function(err, result){
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          _that.setState({interestRatePerDay: result.c[0]})
        }
      });
      _that.state.loanManager.maxLoanPeriodDays.call(function(err, result){
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          _that.setState({maxLoanPeriodDays: result.c[0]})
        }
      });
      _that.state.loanManager.lendableLevel.call(function(err, result){
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          _that.setState({lendableLevel: result.c[0]})
        }
      });
    })
  }

  namehash(name) { var node = '0x0000000000000000000000000000000000000000000000000000000000000000'; if (name != '') { var labels = name.split("."); for(var i = labels.length - 1; i >= 0; i--) { node = this.state.web3.sha3(node + this.state.web3.sha3(labels[i]).slice(2), {encoding: 'hex'}); } } return node.toString(); }

  dateFromTimestamp(timestamp) {
    return new Date(timestamp*1000).toString();
  }

  handleEnsNameSubmit(event) {
    var _that = this,
        ensDomain = _that.namehash(_that.ensNameInput.value),
        onlyDomain = _that.ensNameInput.value.split('.')[0];
    _that.state.ethRegistrar.entries.call(_that.state.web3.sha3(onlyDomain), function(err, result){
      if (err) {
        alert(err);
      }
      else {
        console.log(result);
        _that.state.web3.eth.contract([{ "constant": true, "inputs": [], "name": "creationDate", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "destroyDeed", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "setOwner", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "registrar", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "value", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "previousOwner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newValue", "type": "uint256" }, { "name": "throwOnFailure", "type": "bool" } ], "name": "setBalance", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "refundRatio", "type": "uint256" } ], "name": "closeDeed", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newRegistrar", "type": "address" } ], "name": "setRegistrar", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "_owner", "type": "address" } ], "payable": true, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newOwner", "type": "address" } ], "name": "OwnerChanged", "type": "event" }, { "anonymous": false, "inputs": [], "name": "DeedClosed", "type": "event" }])
          .at(result[1]).owner.call(function(err, deedOwnerAddress){
          _that.setState({
            isOwner: deedOwnerAddress === _that.state.userAccount
          })
          // Populate state with Auction parameters
          if (!_that.state.isOwner) {
            alert('It appears this domain does not belong to you. Please specify a domain that you own.')
            _that.ensNameInput.value = '';
            _that.setState({
              etherLocked: null,
              loanOffered: null,
              loanPeriod: null,
            })
          }
          else {
            var value = _that.state.web3.fromWei(result[3], 'ether').toString(),
              loanAmount = _that.state.lendableLevel * value;
            var registrationtDate = new Date(result[2].c[0]*1000),
              days = _that.dateFromTimestamp(registrationtDate.setDate(registrationtDate.getDate() + 30).toString());
            console.log(registrationtDate);
              _that.setState({
              ensEntry: result,
              ensLoanNode: null,
              etherLocked: value,
              loanOffered: loanAmount,
              loanPeriod: registrationtDate.toString(),
              deedTransferred: false,
              deedReclaimed: false,
            });
          }
        });
      }
    });
    event.preventDefault();
  }

  handleTransferDeedSubmit(event) {
    console.log('handleTransferDeedSubmit');
    var _that = this;
    _that.setState({
      deedTransferred: true,
    })
    // Populate state from Market deployment
    var newDeedOwnerAddress = _that.state.collateralManagerAddress,
      onlyDomain = _that.ensNameInput.value.split('.')[0];
    _that.state.ethRegistrar.transfer(_that.state.web3.sha3(onlyDomain), newDeedOwnerAddress, {from: _that.state.userAccount}, function(err, result) {
      console.log('err');
      console.log(err);
      console.log('result');
      console.log(result);
      // if (err) {
      //   alert(err);
      // }
      // else {
      //   // Update state with the result.
      //   _that.setState({interestRatePerDay: result.c[0]})
      // }
    });
    event.preventDefault();
  }

  handleEscapeHatchClaimDeedSubmit(event) {
    console.log('handleEscapeHatchClaimDeedSubmit');
    var _that = this,
      onlyDomain = _that.ensNameInput.value.split('.')[0];
    _that.state.loanManager.escapeHatchClaimDeed.sendTransaction(onlyDomain, {from: _that.state.userAccount}, function(err, result) {
      console.log('err');
      console.log(err);
      console.log('result');
      console.log(result);
      if (err) {
        alert(err);
      }
      else {
        // Update state with the result.
        console.log('result');
        console.log(result);
      }
    });
    event.preventDefault();
  }

  handleReclaimDeedSubmit(event) {
    console.log('handleReclaimDeedSubmit');
    var _that = this,
      onlyDomain = _that.ensNameInput.value.split('.')[0];
    _that.setState({
      deedReclaimed: true,
    })
    console.log(_that.state.loanManager);
    _that.state.collateralManager.withdrawCollateral.sendTransaction(_that.state.web3.sha3(onlyDomain), {from: _that.state.userAccount}, function(err, result) {
      console.log('err');
      console.log(err);
      console.log('result');
      console.log(result);
      if (err) {
        alert(err);
      }
      else {
        // Update state with the result.
        console.log('result');
        console.log(result);
      }
    });
    event.preventDefault();
  }

  handleRequestLoanSubmit(event) {
    var _that = this;
    // Populate state from Market deployment
    this.state.loanManager.newLoan.sendTransaction(_that.state.web3.sha3(_that.ensNameInput.value.split('.')[0]), {from: _that.state.userAccount}, function(err, result) {
      console.log(err);
      console.log(result);
      if (err) {
        alert(err);
      }
      else {
        // Update state with the result.
        console.log(result);
        // _that.setState({interestRatePerDay: result.c[0]})
      }
    });
    event.preventDefault();
  }

  render() {
    
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Lendroid ENS Loans</a>
        </nav>
        <Tabs>
          <TabList>
            <Tab>Create Loan</Tab>
            <Tab>Loan List</Tab>
          </TabList>
          <TabPanel>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h2>Loan Manager Contract Address: {this.state.loanManagerContractAddress}</h2>
                <h2>
                  {this.state.userAccount}
                  <br />
                  {
                    <form onSubmit={this.handleEscapeHatchClaimDeedSubmit}>
                      <input type="submit" value="Escape Hatch Claim Deed" />
                    </form>
                  }
                </h2>
                <form onSubmit={this.handleEnsNameSubmit}>
                  <label>
                    Your ENS domain name
                    <br />
                    <input type="text" placeholder="domainname.lendroid"ref={(input) => this.ensNameInput = input} />
                  </label>
                  <input type="submit" value="Confirm Domain name" />
                </form>
              </div>
              <div className="pure-u-1-1 ensLoanContainer">
                {((this.state.deedTransferred === false)) &&
                  <div>
                    <br />
                    <form onSubmit={this.handleTransferDeedSubmit}>
                      <input type="submit" value="Transfer Deed" />
                    </form>
                  </div>
                }
                <br />
                {(this.state.deedTransferred === true) &&
                  <div>
                    <br />
                    <form onSubmit={this.handleReclaimDeedSubmit}>
                      <input type="submit" value="Reclaim Deed" />
                    </form>
                  </div>
                }
                {(this.state.deedReclaimed === false) &&
                  <form onSubmit={this.handleRequestLoanSubmit}>
                    <label>Ether Locked : {this.state.etherLocked}</label>
                    <label>Interest Rate : {this.state.interestRatePerDay}</label>
                    <label>Loan Amount Offered : {this.state.loanOffered}</label>
                    <label>Loan Period Ends: {this.state.loanPeriod}</label>
                    <input type="submit" value="Request Loan" />
                  </form>
                }
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h2>{this.state.userAccount}</h2>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App

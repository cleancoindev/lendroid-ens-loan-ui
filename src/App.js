// Front-end components
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
// Smart contracts
import MarketContract from './utils/contracts/Market.json'
import getWeb3 from './utils/web3/getWeb3'
// Components
import LoanCreator from './components/LoanCreator'
import LoanTerminator from './components/LoanTerminator'
// Old CSS
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loanManagerContractAddress: '0x2e1b339111a779ff68ca261afb045937cbfc9bc1',
      collateralManagerAddress: '0xe1f710cc425233320b04f74f231efe77fd162f55',
      userAccount: null,
      web3: null,
      ens: null,
      loanManager: null,
      collateralManager: null,
      ethRegistrar: null
    }
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
      console.log('this.state');
      console.log(this.state);
    })
  }

  render() {
    
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Lendroid ENS Loans"
            showMenuIconButton={false}
          />
          <h2 style={{textAlign: 'center'}}>{this.state.userAccount ? <span>Welcome { this.state.userAccount }!</span> : <span>Please authenticate via MetaMask</span> }</h2>
          {(this.state.userAccount) && (this.state.web3) && 
            <LoanCreator 
              collateralManagerAddress={this.state.collateralManagerAddress}
              userAccount={this.state.userAccount}
              web3={this.state.web3}
              ens={this.state.ens}
              loanManager={this.state.loanManager}
              collateralManager={this.state.collateralManager}
              ethRegistrar={this.state.ethRegistrar}
            />
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App

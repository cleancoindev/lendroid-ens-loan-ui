// Front-end components
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
// Smart contracts
import MarketContract from './utils/contracts/Market.json'
import getWeb3 from './utils/web3/getWeb3'
// Components
import LoanManager from './components/LoanManager'
// Old CSS
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
// Internal CSS
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loanManagerAddress: '0x0f314b4d7563db885ab20ffb9024263b0ea68628',
      collateralManagerAddress: '0x3c1dfdf26eceae63417fb878d809a276bb562566',
      ENSAddress: '0xb766772c58b098d8412143a473aed6bc41c95bde',
      userAccount: null,
      web3: null,
      ens: null,
      loanManager: null,
      collateralManager: null,
      ethRegistrar: null,
      deedContract: null,
      isLoanManagerActive: false,
      selectedLink: 0,
      network: "ropsten"
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
        collateralManagerContract = this.state.web3.eth.contract([{"constant":false,"inputs":[{"name":"_deedAddress","type":"address"}],"name":"forceUnencumberCollateral","outputs":[{"name":"status","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ENSLoanManager","type":"address"}],"name":"changeENSLoanManager","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"encumbered","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ENSLoanManager","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"},{"name":"_requester","type":"address"}],"name":"unencumberCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"}],"name":"escapeHatchClaimDeed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"},{"name":"_requester","type":"address"}],"name":"encumberCollateral","outputs":[{"name":"","type":"bool"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ensDomainHash","type":"bytes32"}],"name":"withdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ensDomainHash","type":"bytes32"},{"indexed":false,"name":"toAddress","type":"address"}],"name":"CollateralWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ensDomainHash","type":"bytes32"},{"indexed":false,"name":"by","type":"address"}],"name":"CollateralEncumbered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ensDomainHash","type":"bytes32"},{"indexed":false,"name":"by","type":"address"}],"name":"CollateralUnencumbered","type":"event"}]),
        deedContract = this.state.web3.eth.contract([{ "constant": true, "inputs": [], "name": "creationDate", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "destroyDeed", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "setOwner", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "registrar", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "value", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "previousOwner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newValue", "type": "uint256" }, { "name": "throwOnFailure", "type": "bool" } ], "name": "setBalance", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "refundRatio", "type": "uint256" } ], "name": "closeDeed", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newRegistrar", "type": "address" } ], "name": "setRegistrar", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "_owner", "type": "address" } ], "payable": true, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newOwner", "type": "address" } ], "name": "OwnerChanged", "type": "event" }, { "anonymous": false, "inputs": [], "name": "DeedClosed", "type": "event" }]);

      this.setState({
        userAccount: accounts[0],
        loanManager: this.state.web3.eth.contract(MarketContract['abi']).at(this.state.loanManagerAddress),
        ens: ensContract.at(this.state.ENSAddress),
        ethRegistrar: registrarContract.at('0xa5c650649b2a8e3f160035cee17b3c7e94b0805f'),
        collateralManager: collateralManagerContract.at(this.state.collateralManagerAddress),
        deedContract: deedContract
      });
      var _that = this;
      this.state.loanManager.active.call(function(err, result){
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          _that.setState({isLoanManagerActive: result})
        }
      });
      console.log('this.state');
      console.log(this.state);
    })
  }

  _selectLink = (index) => this.setState({selectedLink: index});

  _renderTopContent = () => {
    const paperTopAStyle = {
      textAlign: 'justify',
      display: 'inline-block',
      color: "#777",
      fontFamily: "PT Serif, Times New Roman, serif",
      backgroundColor: "#fafafa",
      fontSize: 13,
      lineHeight: "1.4em",
      margin: "0 2.5%",
      padding: "1%",
      width: "45%",
      borderRadius: "10px"
    };
    const paperTopBStyle = {
      textAlign: 'justify',
      display: 'inline-block',
      color: "#777",
      fontFamily: "PT Serif, Times New Roman, serif",
      backgroundColor: "#fafafa",
      fontSize: 13,
      lineHeight: "1.4em",
      margin: "0 2.5%",
      padding: "1%",
      width: "45%",
      borderRadius: "10px"
    };
    return (
      <div style={{margin: "auto"}}>
        <div style={styles.root}>
          <Paper style={paperTopAStyle} zDepth={2} circle={true}>
            <p style={{fontWeight: "bold"}}>
              Lendroid is a decentralized digital asset lending platform. This is a demo designed as a PoC to display 
              what digital asset lending would look like. The first digital asset supported by this demo are 
              ENS names (Ethereum Name Service. To know more: <a href="https://ens.domains" target="_blank">ENS domains</a>), with many more digital assets to come! 
              For the purpose of this demo, we have a simplified version where Lendroid acts as both the lender and 
              the guarantor. To learn more about Lendroid visit: <a href="https://lendroid.com" target="_blank">www.lendroid.com</a> 
            </p>
            <BottomNavigation className="social-media-icons-container" selectedIndex={this.state.selectedLink}>
              <a href='https://twitter.com/lendroidproject' target="_blank"><div className='social-media-icon social-media-twitter'></div></a>
              <a href='http://slack.lendroid.com' target="_blank"><div className='social-media-icon social-media-slack'></div></a>
              <a href='https://github.com/lendroidproject' target="_blank"><div className='social-media-icon social-media-github'></div></a>
              <a href='https://www.youtube.com/channel/UCRPUjdf6DxuUQw789mL25zA' target="_blank"><div className='social-media-icon social-media-youtube'></div></a>
              <a href='https://blog.lendroid.com/' target="_blank"><div className='social-media-icon social-media-medium'></div></a>
            </BottomNavigation>
          </Paper>
          <Paper style={paperTopBStyle} zDepth={2} circle={true}>
            <ul style={{textAlign: "left", fontWeight: "bold", padding: "0", lineHeight: "2em", listStyleType: "none"}}>
              <li>Market status: {this.state.isLoanManagerActive ? "Active" : "Inactive"}</li>
              <li>Your address: {this.state.userAccount}</li>
              <li>ENS address: <a href={"https://" + this.state.network + ".etherscan.io/address/" + this.state.ENSAddress} target="_blank">{this.state.ENSAddress}</a></li>
              <li>Lendroid Collateral Manager address: <a href={"https://" + this.state.network + ".etherscan.io/address/" + this.state.collateralManagerAddress} target="_blank">{this.state.collateralManagerAddress}</a></li>
              <li>Lendroid Loan Manager address: <a href={"https://" + this.state.network + ".etherscan.io/address/" + this.state.loanManagerAddress} target="_blank">{this.state.loanManagerAddress}</a></li>
            </ul>
          </Paper>
        </div>
      </div>
    );
  }

  render() {
    
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Lendroid ENS Loans"
            showMenuIconButton={false}
          />
          <br />
          {this.state.userAccount ? this._renderTopContent() : <h2 style={{textAlign: 'center'}}><span>Please authenticate via MetaMask</span></h2>}
          {(this.state.userAccount) && (this.state.web3) && 
            <LoanManager 
              collateralManagerAddress={this.state.collateralManagerAddress}
              userAccount={this.state.userAccount}
              web3={this.state.web3}
              ens={this.state.ens}
              loanManager={this.state.loanManager}
              collateralManager={this.state.collateralManager}
              ethRegistrar={this.state.ethRegistrar}
              deedContract={this.state.deedContract}
              network={this.state.network}
            />
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App

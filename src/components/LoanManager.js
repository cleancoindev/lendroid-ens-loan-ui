// Front-end components
import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';

// Old CSS
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

// Internal CSS
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class LoanManager extends Component {
  constructor(props) {
    super(props)
    console.log('props');
    console.log(props);
    this.state = {
      loanContractBalance: 0,
      collateralManagerAddress: props.collateralManagerAddress,
      userAccount: props.userAccount,
      web3: props.web3,
      ens: props.ens,
      loanManager: props.loanManager,
      collateralManager: props.collateralManager,
      ethRegistrar: props.ethRegistrar,
      deedContract: props.deedContract,
      // LoanManager Contract specifics
      loanManagerMathDecimals: 4,
      isLoanManagerActive: null,
      interestRatePerDay: null,
      maxLoanPeriodDays: null,
      lendableLevel: null,
      etherLocked: null,
      loanOffered: null,
      loanExpiry: null,
      collateralDeposited: false,
      collateralEncumbered: false,
      // For an active loan
      isLoanActive: false,
      loanDeedAddress: null,
      loanStart: null,
      daysSinceLoanStart: null,
      interestAccruedTillDate: null,
      daysLeftForLoanExpiry: null,
      loanAmountOwed: null,
      // Collateral specifics
      collateralType: 'ENS',
      CollateralTypeENS: 'ENS',
      CollateralTypeBNT: 'BNT (Coming soon)',
      CollateralTypeMLN: 'MLN (Coming soon)',
      CollateralTypeDGX: 'DGX (Coming soon)',
      CollateralTypeSNT: 'SNT (Coming soon)',
      // Loan specifics
      ensNameInput: '',
      isOwner: false,
      deedTransferred: false,
      deedReclaimed: false,
      loanTermsAccepted: false,
      // Stepper params
      finished: false,
      stepIndex: 0,
      // UI states
      depositCollateralWatcher: null,
      depositCollateralWatcherTxHash: null,
      invalidDomainDialogOpen: false,
      insufficientBalanceDialogOpen: false,
      showLoading: false,
      loadingText: "",
    }
  }

  componentWillMount() {
    var _that = this;
    _that.instantiateContract();
    // Event watchers on Loan contract
    // TODO: Deposit Collateral
    // Create Loan
    var LoanCreatedWatcher = this.state.loanManager.loanCreated({toAddress: this.state.userAccount});
    LoanCreatedWatcher.watch(function(error, result){
      if (!error) {
        console.log(result);
        _that._handleNext();
        _that.setState({
          loadingText: "",
          showLoading: false,
        });
      }
    });
    // Close Loan
    var LoanClosedWatcher = this.state.loanManager.loanClosed({by: this.state.userAccount});
    LoanClosedWatcher.watch(function(error, result){
      if (!error) {
        console.log(result);
        _that.setState({
          loadingText: "",
          showLoading: false,
          isLoanActive: false,
          collateralEncumbered: false,
          collateralDeposited: true,
          stepIndex: 3
        });
      }
    });
    // Withdraw Collateral
    var CollateralWithdrawnWatcher = this.state.collateralManager.CollateralWithdrawn({toAddress: this.state.userAccount});
    CollateralWithdrawnWatcher.watch(function(error, result){
      if (!error) {
        console.log(result);
        _that.setState({
          loadingText: "",
          showLoading: false,
          isLoanActive: false,
          collateralEncumbered: false,
          collateralDeposited: false,
        });
      }
    });
  }

  _updateBalance = () => {
    var _that = this;
    console.log('_that.state.loanManager');
    console.log(_that.state.loanManager);
    _that.state.web3.eth.getBalance(_that.state.loanManager.address, function(err, result){
      if (err) {
        alert(err);
      }
      else {
        // Update state with the result.
        _that.setState({loanContractBalance: _that.state.web3.fromWei(result, 'ether').toString()})
      }
    });
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    this.state.web3.eth.getAccounts((error, accounts) => {

      var _that = this;
      console.log('_that.state.loanManager');
      console.log(_that.state.loanManager);
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
      _that.state.loanManager.decimals.call(function(err, result){
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          _that.setState({loanManagerMathDecimals: result.c[0]})
        }
      });
      _that.state.loanManager.active.call(function(err, result){
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          _that.setState({isLoanManagerActive: result})
        }
      });
      _that._updateBalance();
    })
  }

  _dateFromTimestamp = (timestamp) => {
    return new Date(timestamp*1000).toString();
  }

  _handleEnsNameInputChange = (event) => {
    this.setState({
      ensNameInput: event.target.value,
    });
  };

  _dayDiff = (first, second) => {
    first = first ? first : new Date();
    second = second ? second : new Date();
    // if (first === null) first = new Date();
    // if (second === null) second = new Date();
    return Math.round((second-first)/(1000*60*60*24));
  };

  _handleEnsNameSubmit = (event) => {
    if (!this.state.ensNameInput) return false;
    var _that = this,
      onlyDomain = _that.state.ensNameInput.split('.')[0],
      domainSha = _that.state.web3.sha3(onlyDomain);
    console.log('_that.state.ensNameInput');
    console.log(_that.state.ensNameInput);
    console.log('domainSha');
    console.log(domainSha);
    _that.state.ethRegistrar.entries.call(domainSha, function(err, result) {
      if (err) {
        alert(err);
      }
      else {
        console.log(result);
        var deedAddress = result[1],
            deed = _that.state.deedContract.at(deedAddress);
        _that.state.depositCollateralWatcher = deed.OwnerChanged({newOwner: _that.state.userAccount});
        _that.state.depositCollateralWatcher.watch(function(error, result){
          if ((!error) && (result.transactionHash === _that.state.depositCollateralWatcherTxHash)) {
            console.log(result);
            _that._handleNext();
            _that.setState({
              loadingText: "",
              showLoading: false,
            });
          }
        });
        deed.owner.call(function(err, deedOwnerAddress){
          _that.setState({
            isOwner: deedOwnerAddress === _that.state.userAccount
          })
          // Populate state with Auction parameters
          if (!_that.state.isOwner) {
            deed.previousOwner.call(function(err, deedPreviousOwnerAddress) {
              console.log('deedPreviousOwnerAddress');
              console.log(deedPreviousOwnerAddress);
              _that.setState({
                isOwner: deedPreviousOwnerAddress === _that.state.userAccount
              })
              if (!_that.state.isOwner) {
                _that.setState({
                  ensNameInput: '',
                  invalidDomainDialogOpen: true,
                  etherLocked: null,
                  loanOffered: null,
                  loanExpiry: null,
                  collateralDeposited: false,
                  collateralEncumbered: false,
                  isLoanActive: false,
                  stepIndex: 0,
                  loanDeedAddress: null
                })
              }
              else {
                _that.state.loanManager.loans.call(deedAddress, function(err, loan) {
                  
                  var value = _that.state.web3.fromWei(result[3], 'ether').toString(),
                    loanAmount = (_that.state.lendableLevel * value) / (10 ** _that.state.loanManagerMathDecimals),
                    registrationtDate = new Date(result[2].c[0]*1000),
                    today = new Date();
                  // Check if the contract has enough balance to offer a loan

                  // Set values for step 1
                  console.log(registrationtDate);
                  var tmpRegDate = registrationtDate,
                    expirationDate = new Date(tmpRegDate.setDate(tmpRegDate.getDate()+30));
                  console.log(expirationDate);
                  _that.setState({
                    ensEntry: result,
                    ensLoanNode: null,
                    stepIndex: 1,
                    collateralDeposited: true,
                    isLoanActive: false,
                    collateralEncumbered: false,
                    loanDeedAddress: deedAddress,
                    etherLocked: value,
                    loanOffered: loanAmount,
                    loanExpiry: expirationDate.toString(),
                    deedTransferred: true,
                    deedReclaimed: false
                  });
                  console.log('loan');
                  console.log(loan);
                  var createdTimestamp = loan[2].toString();
                  console.log('createdTimestamp');
                  console.log(createdTimestamp);
                  var daysSinceLoanTimestamp = createdTimestamp ? _that._dayDiff(null, new Date(createdTimestamp * 1000)) : createdTimestamp;
                  console.log('daysSinceLoanTimestamp');
                  console.log(daysSinceLoanTimestamp);
                  if ((loan[3] === _that.state.userAccount) && (loan[4] === deedAddress) && ((daysSinceLoanTimestamp === -0) || (daysSinceLoanTimestamp > 0)) ) {
                    console.log('loan[10].toString()');
                    console.log(loan[10].toString());
                    if ((loan[10].toString() === '1')) {
                      _that.setState({
                        stepIndex: 2
                      });
                      var loanStartDate = new Date(loan[2].c[0]*1000),
                        daysSinceStart = _that._dayDiff(loanStartDate, null);
                      console.log('The loan is active');
                      _that.state.loanManager.amountOwed.call(deedAddress, function(err, amount) {
                        console.log('amountOwed');
                        console.log(amount);
                        var amt = _that.state.web3.fromWei(amount, 'ether').toString();
                        console.log(amt);
                        _that.setState({
                          loanAmountOwed: amt,
                          interestAccruedTillDate: amt - loanAmount,
                        });
                      })
                      _that.setState({
                        collateralEncumbered: true,
                        isLoanActive: true,
                        loanStart: loanStartDate.toString(),
                        daysSinceLoanStart: daysSinceStart,
                        // interestAccruedTillDate: ((daysSinceStart -1) * _that.state.interestRatePerDay * loanAmount * 0.0001),
                        daysLeftForLoanExpiry: _that._dayDiff(null, expirationDate),
                      })
                    }
                    else {
                      console.log('The loan is not active');
                    }
                  }
                  // console.log('_that.state');
                  // console.log(_that.state);
                  _that._handleNext();
                });
              }
            });
          }
          else {
            var value = _that.state.web3.fromWei(result[3], 'ether').toString(),
              loanAmount = (_that.state.lendableLevel * value) / (10 ** _that.state.loanManagerMathDecimals),
              registrationtDate = new Date(result[2].c[0]*1000);
            console.log(registrationtDate);
              _that.setState({
                ensEntry: result,
                loanDeedAddress: deedAddress,
                ensLoanNode: null,
                etherLocked: value,
                loanOffered: loanAmount,
                loanExpiry: registrationtDate.toString(),
                deedTransferred: false,
                deedReclaimed: false,
                collateralDeposited: false,
                collateralEncumbered: false,
                isLoanActive: false,
                stepIndex: 0
              });
            _that._handleNext();
          }
        });
      }
    });
    event.preventDefault();
  }

  _handleTransferDeedSubmit = (event) => {
    console.log('_handleTransferDeedSubmit');
    var _that = this;
    // Check if we can give a loan
    if (_that.state.loanContractBalance >= _that.state.loanOffered) {
      _that.setState({
        deedTransferred: true,
      })
      // Populate state from Market deployment
      var onlyDomain = _that.state.ensNameInput.split('.')[0];
      _that.state.ethRegistrar.transfer(
        _that.state.web3.sha3(onlyDomain), 
        _that.state.collateralManagerAddress, 
        {from: _that.state.userAccount}, 
        function(err, txHash) {
          console.log('err');
          console.log(err);
          console.log('txHash');
          console.log(txHash);
          // _that._handleNext();
          _that.setState({
            depositCollateralWatcherTxHash: txHash,
            loadingText: "Depositing Collateral ...",
            showLoading: true
          });
        }
      );
    }
    else {
      console.log('Not enough balance');
      _that.setState({insufficientBalanceDialogOpen: true})
    }
    event.preventDefault();
  }

  _handleReclaimDeedSubmit = (event) => {
    console.log('_handleReclaimDeedSubmit');
    var _that = this,
      onlyDomain = _that.state.ensNameInput.split('.')[0];
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
        // _that._handlePrev()
        _that.setState({
          loadingText: "Withdrawing Collateral ...",
          showLoading: true
        });
      }
    });
    event.preventDefault();
  }

  _handleRequestLoanSubmit = (event) => {
    var _that = this;
    if (_that.state.loanContractBalance >= _that.state.loanOffered) {
      var onlyDomain = _that.state.ensNameInput.split('.')[0],
        domainSha = _that.state.web3.sha3(onlyDomain);
      // Populate state from Market deployment
      _that.state.loanManager.createLoan.sendTransaction(onlyDomain, domainSha, {from: _that.state.userAccount}, function(err, result) {
        console.log(err);
        console.log(result);
        if (err) {
          alert(err);
        }
        else {
          // Update state with the result.
          console.log(result);
          _that.setState({
            showLoading: true,
            loadingText: "Creating Loan ..."
          })
          // _that.setState({interestRatePerDay: result.c[0]})
        }
      });
    }
    else {
      console.log('Not enough balance');
      _that.setState({insufficientBalanceDialogOpen: true})
    }
    event.preventDefault();
  }

  _handleCloseLoanSubmit = (event) => {
    var _that = this;
    _that.state.loanManager.closeLoan.sendTransaction(_that.state.loanDeedAddress, {from: _that.state.userAccount, value: _that.state.web3.toWei(_that.state.loanAmountOwed, 'ether')}, function(err, result) {
      console.log('closeLoan');
      console.log(err);
      console.log(result);
      if (err) {
        alert(err);
      }
      else {
        // Update state with the result.
        console.log(result);
        _that.setState({
          loadingText: "Closing Loan ...",
          showLoading: true
        });
        // _that._handleNext();
        // _that.setState({interestRatePerDay: result.c[0]})
      }
    });
    event.preventDefault();
  }

  _handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
    });
  };

  _handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  _toggleLoanTermsAcceptance = () => {
    this.setState({loanTermsAccepted: !this.state.loanTermsAccepted});
  };

  _renderLoanSpecs = () => {
    const {etherLocked, interestRatePerDay, loanOffered, loanExpiry, ensNameInput, loanManagerMathDecimals} = this.state;
    const paperStep3Style = {
      textAlign: 'center',
    };

    return (
        <Table style={paperStep3Style}>
            <TableHeader displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>Term</TableHeaderColumn>
                    <TableHeaderColumn>Value</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                <TableRow>
                    <TableRowColumn>
                      <h4>Value Of Collateral</h4>
                      Amount locked in your deed that is backing your ENS name
                    </TableRowColumn>
                    <TableRowColumn>{ etherLocked } ETH</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>
                      <h4>Loan Offered</h4>
                      For this particular collateral type, we offer upto 80% of the appraised value of the collateral as a loan
                    </TableRowColumn>
                    <TableRowColumn>{ loanOffered } ETH</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>
                      <h4>Interest rate (per day)</h4>
                      For the demo, the interest rate is fixed. In the future the interest rate will be driven by the market
                    </TableRowColumn>
                    <TableRowColumn>{ interestRatePerDay / (10 ** loanManagerMathDecimals) } %</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>
                      <h4>Loan expiry</h4>
                      The loan is expected to be paid in full (principal + interest accrued on or before this date)
                    </TableRowColumn>
                    <TableRowColumn>{ loanExpiry }</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )
  }

  _handleCollateralTypeChange = (event, index, value) => this.setState({collateralType: value});

  _handleInvalidDomainNameDialogClose = () => {
    this.setState({invalidDomainDialogOpen: false});
  };

  _handleInsufficientBalanceDialogClose = () => {
    this.setState({insufficientBalanceDialogOpen: false});
  };
  
  _renderWithdrawAndCloseSpecs = () => {
    const { collateralType, ensNameInput, collateralDeposited, isLoanActive, collateralEncumbered } = this.state;
    const textDecorationDeposited = (collateralDeposited && !isLoanActive && !collateralEncumbered) ? "none" : "line-through";
    const textDecorationEncumbered = (collateralDeposited && isLoanActive && collateralEncumbered) ? "none" : "line-through";
    return (
      <div>
        <Table style={{textAlign: "center"}}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                <h4>Collateral type</h4>
              </TableRowColumn>
              <TableRowColumn>{ collateralType }</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
                <h4>Collateral name</h4>
              </TableRowColumn>
              <TableRowColumn>{ ensNameInput }</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
                <h4>Status</h4>
              </TableRowColumn>
              <TableRowColumn>
                <ul style={{paddingLeft: 0}}>
                  <li style={{textDecoration: textDecorationDeposited}}>Free to withdraw</li>
                  <li style={{textDecoration: textDecorationEncumbered}}>Locked</li>
                </ul>
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <div style={{textAlign: "center", margin: '12px 0'}}>
          <RaisedButton
            label="Withdraw Your Collateral"
            disabled={!(collateralDeposited && !isLoanActive && !collateralEncumbered)}
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onTouchTap={this._handleReclaimDeedSubmit}
            style={{marginRight: 12}}
          />
        </div>
      </div>
    )
  }

  _renderContentStep1 = () => {
    const invalidDomainNameDialogActions = [
        <FlatButton
          label="Got it"
          primary={true}
          onTouchTap={this._handleInvalidDomainNameDialogClose}
        />
      ];
    const paperStep1Style = {
      margin: 10,
      textAlign: 'justify',
      display: 'inline-block',
      color: "#555",
      fontFamily: "PT Serif, Times New Roman, serif",
      backgroundColor: "white",
      fontSize: 14,
      lineHeight: "1.52em",
      margin: "10 auto",
      padding: "2.5% 5%"
    };
    return (
      <div style={{margin: 'auto', textAlign: "center"}}>
        <Paper style={paperStep1Style} zDepth={2} rounded={false}>
          <SelectField
            floatingLabelText="Choose your collateral type"
            value={this.state.collateralType}
            onChange={this._handleCollateralTypeChange}
          >
            <MenuItem value={this.state.CollateralTypeENS} primaryText={this.state.CollateralTypeENS} />
            <MenuItem value={this.state.CollateralTypeBNT} primaryText={this.state.CollateralTypeBNT} disabled={true} />
            <MenuItem value={this.state.CollateralTypeMLN} primaryText={this.state.CollateralTypeMLN} disabled={true} />
            <MenuItem value={this.state.CollateralTypeDGX} primaryText={this.state.CollateralTypeDGX} disabled={true} />
            <MenuItem value={this.state.CollateralTypeSNT} primaryText={this.state.CollateralTypeSNT} disabled={true} />
          </SelectField>
          <br />
          <TextField
              hintText="Eg, domainname.lendroid"
              floatingLabelText="Please enter the full domain name"
              floatingLabelFixed={true}
              value={this.state.ensNameInput}
              onChange={this._handleEnsNameInputChange}
          />
          <p>
            Don't have an ENS domain?. Click <a href="#">here</a> to get one.
          </p>
        </Paper>
        <div style={{margin: '12px 0'}}>
            <RaisedButton
                label={"Proceed"}
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onTouchTap={this._handleEnsNameSubmit}
                style={{marginRight: 12}}
            />
        </div>
        <Dialog
          title="Invalid Domain input"
          actions={invalidDomainNameDialogActions}
          modal={true}
          open={this.state.invalidDomainDialogOpen}
        >
          It appears this name does not belong to the address {this.state.userAccount}. Please check that you have entered the right address/name and try again.
        </Dialog>
      </div>
    );
  }

  _renderContentStep2 = () => {
    const paperStep2Style = {
      margin: 10,
      textAlign: 'justify',
      display: 'inline-block',
      color: "#555",
      fontFamily: "PT Serif, Times New Roman, serif",
      backgroundColor: "white",
      fontSize: 14,
      lineHeight: "1.52em",
      margin: "10 auto",
      padding: "2.5% 5%"
    };
    return (
      <div style={{margin: 'auto'}}>
        <Paper style={paperStep2Style} zDepth={2} rounded={false}>
          <p>
            In the following steps, the collateral is locked in a smart contract (Lendroid Collateral Manager) 
            deployed at:{this.state.collateralManagerAddress}. At any point in time, ONLY YOU can reclaim it 
            (given there are no active loans against this collateral). During the period of the loan, 
            the collateral remains with the smart contract until you are ready to reclaim it. 
            No one, except this address, will be able to withdraw the collateral from the LCM*. This smart contract 
            has been audited by open Zep and you can find the audit results below:<br />
            Code: { "https://github.com/lendroidproject/lendroid-ens-loan" }
            <br />
            Etherscan link: {this.state.collateralManagerAddress}
            <br />
            Audit result: 
          </p>
          <p>
            *During the demo period, we have a fail-safe function which lets us transfer the collateral 
            in case of an emergency. This will be phased out with time.
          </p>
        </Paper>
        <div style={{margin: '12px auto', textAlign: 'center'}}>
            <RaisedButton
                label="Deposit Collateral"
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onTouchTap={this._handleTransferDeedSubmit}
                style={{marginRight: 12}}
            />
            <FlatButton
                label="Back to Previous Step"
                disabled={this.state.stepIndex === 0}
                disableTouchRipple={true}
                disableFocusRipple={true}
                onTouchTap={this._handlePrev}
            />
        </div>
      </div>
    );
  }

  _renderContentStep3 = () => {
    const paperStep3Style = {
      margin: 10,
      textAlign: 'justify',
      display: 'inline-block',
      color: "#555",
      fontFamily: "PT Serif, Times New Roman, serif",
      backgroundColor: "white",
      fontSize: 14,
      lineHeight: "1.52em",
      margin: "10 auto",
      padding: "2.5% 5%",
      width: "50%"
    };
    return (
      <div style={{margin: "auto"}}>
        <div style={styles.root}>
          <Paper style={paperStep3Style} zDepth={2} rounded={false}>
            <p style={{textAlign: "center", fontWeight: "bold"}}>
                Loan Terms
            </p>
            { this._renderLoanSpecs() }
            <p style={{marginTop: 50, textAlign: "center", fontSize: 14, lineHeight: "1.52em"}}>
              I understand that failing to close the loan by { this.state.loanExpiry } will result in forfeiting the rights to reclaim my collateral.
            </p>
            <Checkbox
              label="I understand and accept the loan terms and conditions."
              checked={this.state.loanTermsAccepted}
              onCheck={this._toggleLoanTermsAcceptance}
              disabled={!this.state.collateralDeposited}
            />
            <div style={{textAlign: "center", margin: '12px 0'}}>
              <RaisedButton
                label="Avail Loan"
                disabled={!this.state.loanTermsAccepted}
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onTouchTap={this._handleRequestLoanSubmit}
                style={{marginRight: 12}}
              />
            </div>
          </Paper>
          <Paper style={paperStep3Style} zDepth={2} rounded={false}>
            { this._renderWithdrawAndCloseSpecs() }
          </Paper>
        </div>
      </div>
    );
  }

  _renderContentStep4 = () => {
    const {etherLocked, interestRatePerDay, loanOffered, loanExpiry, loanStart, ensNameInput, loanManagerMathDecimals, daysSinceLoanStart, daysLeftForLoanExpiry, interestAccruedTillDate, loanAmountOwed} = this.state;
    
    const paperStep4Style = {
      margin: 10,
      textAlign: 'justify',
      display: 'inline-block',
      color: "#555",
      fontFamily: "PT Serif, Times New Roman, serif",
      backgroundColor: "white",
      fontSize: 14,
      lineHeight: "1.52em",
      margin: "10 auto",
      padding: "2.5% 5%",
      width: "50%"
    };
    return (
      <div style={{margin: "auto"}}>
        <div style={styles.root}>
          <Paper style={paperStep4Style} zDepth={2} rounded={false}>
            <Table style={paperStep4Style}>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>
                    <h4>Loan start date</h4>
                  </TableRowColumn>
                  <TableRowColumn>{ loanStart }</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <h4>Principal</h4>
                  </TableRowColumn>
                  <TableRowColumn>{ loanOffered } ETH</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <h4>Interest rate (per day)</h4>
                  </TableRowColumn>
                  <TableRowColumn>{ interestRatePerDay / (10 ** loanManagerMathDecimals) } %</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <h4>Days since loan started</h4>
                  </TableRowColumn>
                  <TableRowColumn>{ daysSinceLoanStart }</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <h4>Interest accrued till date</h4>
                  </TableRowColumn>
                  <TableRowColumn>
                    { interestAccruedTillDate } ETH
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <h4>Time left till expiry</h4>
                  </TableRowColumn>
                  <TableRowColumn>{ daysLeftForLoanExpiry } days</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>
                    <h4>Amount to be paid for closing the loan now</h4>
                  </TableRowColumn>
                  <TableRowColumn>{ loanAmountOwed } ETH</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
            <div style={{textAlign: "center", margin: '12px 0'}}>
              <RaisedButton
                label="Close Loan"
                disabled={!this.state.isLoanActive}
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onTouchTap={this._handleCloseLoanSubmit}
                style={{marginRight: 12}}
              />
            </div>
            <Divider />
            <p>
              Your collateral is not withdrawn automatically. You can now choose to start another loan 
              or withdraw the collateral by pressing on the button to your right. 
              Thank you for using Lendroid!
            </p>
          </Paper>
          <Paper style={paperStep4Style} zDepth={2} rounded={false}>
            { this._renderWithdrawAndCloseSpecs() }
            <Divider />
            <div style={{textAlign: "center", margin: '12px 0'}}>
              <RaisedButton
                label="Start Over"
                disableTouchRipple={true}
                disableFocusRipple={true}
                primary={true}
                onTouchTap={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
                style={{marginRight: 12}}
              />
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  renderStepActions = (step) => {
    const {stepIndex} = this.state;

    return (
      <div style={{margin: '12px 0'}}>
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this._handlePrev}
          />
        )}
        <RaisedButton
          label={stepIndex === 2 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this._handleNext}
          style={{marginLeft: 12}}
        />
      </div>
    );
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return this._renderContentStep1();
      case 1:
        return this._renderContentStep2();
      case 2:
        return this._renderContentStep3();
      default:
        return this._renderContentStep4();
        break;
    }
  }

  render() {
    
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    const componentStyles = {
      loadingContainer: {
        position: 'relative',
        textAlign: 'center'
      },
      loadingRefresh: {
        display: 'inline-block',
        position: 'relative',
      },
    };
    const insufficientBalanceDialogActions = [
        <FlatButton
          label="Got it"
          primary={true}
          onTouchTap={this._handleInsufficientBalanceDialogClose}
        />
      ];

    return (
      <div style={{width: '100%', maxWidth: 1024, margin: 'auto'}}>
        <Dialog
          title="Insufficient Balance"
          actions={insufficientBalanceDialogActions}
          modal={true}
          open={this.state.insufficientBalanceDialogOpen}
        >
          Sorry, the smart contract does not have sufficient balance to offer a loan for this collateral.
        </Dialog>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Choose Collateral</StepLabel>
          </Step>
          <Step>
            <StepLabel>Deposit Collateral</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirm and Avail Loan</StepLabel>
          </Step>
          <Step>
            <StepLabel>Close Loan</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              {this.state.showLoading ? this.state.loadingText : this.getStepContent(stepIndex)}
            </div>
          )}
          <div style={componentStyles.loadingContainer}>
            <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status={this.state.showLoading ? "loading" : "hide"}
              style={componentStyles.loadingRefresh}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LoanManager

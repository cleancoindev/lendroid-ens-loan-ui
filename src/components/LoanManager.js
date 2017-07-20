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
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// Old CSS
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'


class LoanManager extends Component {
  constructor(props) {
    super(props)
    console.log('props');
    console.log(props);
    this.state = {
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
        loanPeriod: null,
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
        invalidDomainDialogOpen: false
    }
  }

  componentWillMount() {
    this.instantiateContract();
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
                  loanPeriod: null,
                })
              }
              else {
                var currentStep = 1;
                _that.state.loanManager.loans.call(deedAddress, function(err, loan) {
                  console.log('loan');
                  console.log(loan);
                  if ((loan[3] === _that.state.userAccount) && (loan[4] === deedAddress)) {
                    console.log('The loan is active');
                    // currentStep = 2;

                  }
                });
                var value = _that.state.web3.fromWei(result[3], 'ether').toString(),
              loanAmount = (_that.state.lendableLevel * value) / (10 ** _that.state.loanManagerMathDecimals),
              registrationtDate = new Date(result[2].c[0]*1000);
              console.log(registrationtDate);
                _that.setState({
                  ensEntry: result,
                  ensLoanNode: null,
                  etherLocked: value,
                  loanOffered: loanAmount,
                  loanPeriod: registrationtDate.toString(),
                  deedTransferred: true,
                  deedReclaimed: false,
                  stepIndex: currentStep
                });
                _that._handleNext();
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
                ensLoanNode: null,
                etherLocked: value,
                loanOffered: loanAmount,
                loanPeriod: registrationtDate.toString(),
                deedTransferred: false,
                deedReclaimed: false,
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
    _that.setState({
      deedTransferred: true,
    })
    // Populate state from Market deployment
    var onlyDomain = _that.state.ensNameInput.split('.')[0];
    _that.state.ethRegistrar.transfer(
        _that.state.web3.sha3(onlyDomain), 
        _that.state.collateralManagerAddress, 
        {from: _that.state.userAccount}, 
        function(err, result) {
            console.log('err');
            console.log(err);
            console.log('result');
            console.log(result);
            _that._handleNext();
        }
    );
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
        _that._handlePrev()
      }
    });
    event.preventDefault();
  }

  _handleRequestLoanSubmit = (event) => {
    var _that = this,
      onlyDomain = _that.state.ensNameInput.split('.')[0],
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
        _that._handleNext();
        // _that.setState({interestRatePerDay: result.c[0]})
      }
    });
    event.preventDefault();
  }

  _handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
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
    const {etherLocked, interestRatePerDay, loanOffered, loanPeriod, ensNameInput, loanManagerMathDecimals} = this.state;
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
                    <TableRowColumn>{ loanPeriod }</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )
  }

  _handleCollateralTypeChange = (event, index, value) => this.setState({collateralType: value});

  _handleInvalidDomainNameDialogClose = () => {
    this.setState({invalidDomainDialogOpen: false});
  };

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
            Code:
            <br />
            Etherescan link:
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
      padding: "2.5% 5%"
    };
    return (
      <div style={{margin: "auto"}}>
        <Paper style={paperStep3Style} zDepth={2} rounded={false}>
          <p style={{textAlign: "center", fontWeight: "bold"}}>
              Loan Terms
          </p>
          {/* <div style={{margin: '12px 0'}}>
              <FlatButton
                  label="Reclaim Your Deposit"
                  disabled={this.state.stepIndex === 0}
                  disableTouchRipple={true}
                  disableFocusRipple={true}
                  onTouchTap={this._handleReclaimDeedSubmit}
              />
          </div> */}
          { this._renderLoanSpecs() }
          <p style={{marginTop: 50, textAlign: "center", fontSize: 14, lineHeight: "1.52em"}}>
            I understand that failing to close the loan by { this.state.loanPeriod } will result in forfeiting the rights to reclaim my collateral.
          </p>
          <Checkbox
            label="I understand and accept the loan terms and conditions."
            checked={this.state.loanTermsAccepted}
            onCheck={this._toggleLoanTermsAcceptance}
          />
        </Paper>
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
        // return this._renderContentStep1();
        break;
    }
  }

  render() {
    
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 1024, margin: 'auto'}}>
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
              {this.getStepContent(stepIndex)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default LoanManager

// Front-end components
import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// Old CSS
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'


class LoanTerminator extends Component {
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
        // LoanManager Contract specifics
        isLoanManagerActive: null,
        interestRatePerDay: null,
        maxLoanPeriodDays: null,
        lendableLevel: null,
        etherLocked: null,
        loanOffered: null,
        loanPeriod: null,
        // Loan specifics
        ensNameInput: '',
        deedAddress: '',
        isBorrower: false,
        deedTransferred: false,
        deedReclaimed: false,
        loanTermsAccepted: false,
        // Stepper params
        finished: false,
        stepIndex: 0,
    }
    // Helper functions
    this.dateFromTimestamp = this.dateFromTimestamp.bind(this);
    // Public functions
    this.handleEnsNameSubmit = this.handleEnsNameSubmit.bind(this);
    this.handleCloseLoanSubmit = this.handleCloseLoanSubmit.bind(this);
    this.namehash = this.namehash.bind(this);
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
    })
  }

  namehash(name) { var node = '0x0000000000000000000000000000000000000000000000000000000000000000'; if (name != '') { var labels = name.split("."); for(var i = labels.length - 1; i >= 0; i--) { node = this.state.web3.sha3(node + this.state.web3.sha3(labels[i]).slice(2), {encoding: 'hex'}); } } return node.toString(); }

  dateFromTimestamp(timestamp) {
    return new Date(timestamp*1000).toString();
  }

  handleEnsNameInputChange = (event) => {
    this.setState({
      ensNameInput: event.target.value,
    });
  };

  handleEnsNameSubmit(event) {
    var _that = this,
        ensDomain = _that.namehash(_that.state.ensNameInput),
        onlyDomain = _that.state.ensNameInput.split('.')[0],
        domainSha = _that.state.web3.sha3(onlyDomain);
    console.log('_that.state.ensNameInput');
    console.log(_that.state.ensNameInput);
    console.log('domainSha');
    console.log(domainSha);
    _that.state.ethRegistrar.entries.call(domainSha, function(err, result){
      if (err) {
        alert(err);
      }
      else {
        console.log(result);
        _that.setState({
            deedAddress: result[1]
        });
        _that.state.loanManager.loans.call(_that.state.deedAddress, function(err, result){
            if (err) {
                alert(err);
            }
            else {
            // Update state with the result.
                console.log(result);
                // _that.setState({
                //     isBorrower: deedOwnerAddress === _that.state.userAccount
                // })
                if (!_that.state.isBorrower) {
                    alert('It appears this domain does not belong to you. Please specify a domain that you have borrowed a loan against.')
                    _that.state.ensNameInput = '';
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
                    _that.handleNext();
                }
            }
        });
        // Populate state with Auction parameters
      }
    });
    event.preventDefault();
  }

  handleCloseLoanSubmit(event) {
    var _that = this,
      onlyDomain = _that.state.ensNameInput.split('.')[0];
      // Populate state from Market deployment
    _that.state.loanManager.createLoan.sendTransaction(onlyDomain, {from: _that.state.userAccount}, function(err, result) {
      console.log(err);
      console.log(result);
      if (err) {
        alert(err);
      }
      else {
        // Update state with the result.
        console.log(result);
        _that.handleNext();
        // _that.setState({interestRatePerDay: result.c[0]})
      }
    });
    event.preventDefault();
  }

  handleNext = () => {
    // if (step == 1) {
    //     this.handleEnsNameSubmit
    // }
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  toggleLoanTermsAcceptance = () => {
    this.setState({loanTermsAccepted: !this.state.loanTermsAccepted});
  };

  renderLoanSpecs() {
    const {etherLocked, interestRatePerDay, loanOffered, loanPeriod, ensNameInput} = this.state;

    return (
        <Table>
            <TableHeader displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>Term</TableHeaderColumn>
                    <TableHeaderColumn>Value</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                <TableRow>
                    <TableRowColumn>Value Of { ensNameInput }</TableRowColumn>
                    <TableRowColumn>{ etherLocked }</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>Loan Amount We Can Offer</TableRowColumn>
                    <TableRowColumn>{ loanOffered }</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>Interest Charged Per Day On The Loan</TableRowColumn>
                    <TableRowColumn>{ interestRatePerDay }</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>Date On or Before Which Loan Is Expected To Be Paid In Full</TableRowColumn>
                    <TableRowColumn>{ loanPeriod }</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )
  }

  renderStepActions(step) {
    const {stepIndex} = this.state;

    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label={stepIndex === 2 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    
    const {finished, stepIndex} = this.state;

    return (
        <div style={{margin: 'auto'}}>
            <Stepper activeStep={stepIndex} orientation="vertical">
                <Step>
                    <StepLabel>Verify Deposited ENS Domain</StepLabel>
                    <StepContent>
                        <TextField
                            hintText="Eg, domainname.lendroid"
                            floatingLabelText="Please enter the full domain name"
                            floatingLabelFixed={true}
                            value={this.state.ensNameInput}
                            onChange={this.handleEnsNameInputChange}
                        />
                        <div style={{margin: '12px 0'}}>
                            <RaisedButton
                                label={'Verify "' + this.state.ensNameInput + '"'}
                                disableTouchRipple={true}
                                disableFocusRipple={true}
                                primary={true}
                                onTouchTap={this.handleEnsNameSubmit}
                                style={{marginRight: 12}}
                            />
                        </div>
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>Confirm and Close Your Loan</StepLabel>
                    <StepContent>
                    <p>
                        { this.renderLoanSpecs() }
                        <Checkbox
                            label={"I hereby wish to settle my loan borrowed against " + this.state.ensNameInput + " by paying the loan amount of " + this.state.loanOffered + " Ether"}
                            checked={this.state.loanTermsAccepted}
                            onCheck={this.toggleLoanTermsAcceptance}
                        />
                    </p>
                    <div style={{margin: '12px 0'}}>
                        <RaisedButton
                            label="Close Your Loan"
                            disabled={!this.state.loanTermsAccepted}
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            primary={true}
                            onTouchTap={this.handleCloseLoanSubmit}
                            style={{marginRight: 12}}
                        />
                    </div>
                    </StepContent>
                </Step>
            </Stepper>
            {finished && (
            <p style={{margin: '20px 0', textAlign: 'center'}}>
                Congratulations! Your Loan period with us has been closed. Please feel free to reach out to us on Slack if you have any questions. Meanwhile, also feel free to <a
                href="#"
                onClick={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false, ensNameInput: ''});
                }}
                >
                click here
                </a> if you would like to close another loan.
            </p>
            )}
        </div>
    );
  }
}

export default LoanTerminator

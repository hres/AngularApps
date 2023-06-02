<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
               xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xsl:param name="language" select="'eng'"/>
  <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'"/>
  <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=9"/>
        <style type="text/css">
<xsl:text disable-output-escaping="yes">
html {
    font-family: sans-serif;
	font-size: 10px;
    -webkit-tap-highlight-color: transparent
    display: block;
    color: -internal-root-color;
}

body {
	background: #f9f9f9;
    line-height: 1.4375;
    color: #333;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 16px;
    margin: 0;
}
, :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.well {
    min-height: 20px;
    padding: 19px;
    margin-bottom: 20px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05)
}

.well blockquote {
    border-color: #ddd;
    border-color: rgba(0, 0, 0, .15)
}

.well-lg {
    padding: 24px;
    border-radius: 6px
}

.well-sm {
    padding: 9px;
    border-radius: 3px
}
article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {
    display: block
}
.panel {
    margin-bottom: 23px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05)
}

.panel-body {
    padding: 15px
}

.panel-body:after, .panel-body:before {
    content: " ";
    display: table
}

.panel-body:after {
    clear: both
}

.panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px
}

.panel-heading .dropdown .dropdown-toggle {
    color: inherit
}

.panel-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 18px;
    color: inherit
}

.panel-title a {
    color: inherit
}

.panel-footer {
    padding: 10px 15px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px
}

.panel .list-group, .panel .panel-collapse .list-group {
    margin-bottom: 0
}

.panel .list-group .list-group-item, .panel .panel-collapse .list-group .list-group-item {
    border-width: 1px 0;
    border-radius: 0
}

.panel .list-group:first-child .list-group-item:first-child, .panel .panel-collapse .list-group:first-child .list-group-item:first-child {
    border-top: 0;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px
}

.panel .list-group:last-child .list-group-item:last-child, .panel .panel-collapse .list-group:last-child .list-group-item:last-child {
    border-bottom: 0;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px
}
.panel-default {
    border-color: #ddd
}
.panel-default .panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd
}

.panel-default  .panel-heading + .panel-collapse .panel-body {
    border-top-color: #ddd
}

.panel-default  .panel-heading .badge {
    color: #f5f5f5;
    background-color: #333
}

.panel-default  .panel-footer + .panel-collapse .panel-body {
    border-bottom-color: #ddd
}
.panel-primary {
    border-color: #2572b4
}
.panel-primary  .panel-heading {
    color: #fff;
    background-color: #2572b4;
    border-color: #2572b4
}

.panel-primary  .panel-heading + .panel-collapse .panel-body {
    border-top-color: #2572b4
}

.panel-primary  .panel-heading .badge {
    color: #2572b4;
    background-color: #fff
}

.panel-primary  .panel-footer + .panel-collapse .panel-body {
    border-bottom-color: #2572b4
}
.panel-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 18px;
    color: inherit
}

.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    font-family: Helvetica, Arial, sans-serif
}
.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
}
.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
    color: inherit;
}
h1 {
    margin: .67em 0;
}

h1 {
    border-bottom: 1px solid #af3c43;
    font-size: 34px;
    margin-bottom: .2em;
    margin-top: 1.25em;
    padding-bottom: .2em
}
table {
    background-color: transparent;
    display: table;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
.table tbody tr td, .table tbody tr th, .table tfoot tr td, .table tfoot tr th, .table thead tr td, .table thead tr th {
    padding: 8px;
    line-height: 1.4375;
    vertical-align: top;
    border-top: 1px solid #ddd;
}
thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
}
table.dataTable, table.dataTable td, table.dataTable th {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}
td, th {
    padding: 0
}
table.dataTable {
    border-collapse: separate;
    border-spacing: 0;
    margin: 0 auto;
    width: 100% !important;
}
table.dataTable, table.dataTable td, table.dataTable th {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}
.panel .table-responsive:last-child .table:last-child, .panel .table:last-child {
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}
.dataTables_wrapper .dataTables_scroll, table.dataTable {
    clear: both;
}
tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}
.table-striped tbody tr:nth-child(odd) {
    background-color: #f5f5f5;
}
table.dataTable tbody tr {
    background-color: #fff;
}
.row {
    margin-left: -15px;
    margin-right: 15px;
}

.row:after, .row:before {
    content: " ";
    display: table
}

.row:after {
    clear: both
}
.col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
}

.col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
    float: left;
}

.col-xs-12 {
    width: 100%;
}
.col-md-12 {
	width: 100%;
}
.col-xs-6 {
    width: 48%;
}
.col-md-5 {
    width: 40%;
}
.col-xs-2 {
    width: 16.6666666667%;
}
.col-xs-1 {
    width: 8.3333333333%
}
.col-xs-11 {
    width: 91.6666666667%
}
.col-xs-7 {
    width: 52%;
}

legend {
    padding-inline-start: 2px;
    padding-inline-end: 2px;
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 23px;
    font-size: 24px;
    line-height: inherit;
    color: #333;
    border: 0;
    border-bottom: 0;
    float: left;
}
.form-group {
    margin-bottom: 15px;
}
.col-md-6 {
    width: 48%;
}
.col-xs-3 {
    width: 25%;
}
.col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9 {
    float: left;
}
.alert-info, .label-info, .label-info[href]:active, .label-info[href]:focus, .label-info[href]:hover, details.alert.alert-info, details.alert[open].alert-info
 {
    background: #d7faff;
    border-color: #269abc;
}
.alert-danger, .alert-info, .alert-success, .alert-warning, .label-danger, .label-danger[href]:active, .label-danger[href]:focus, .label-danger[href]:hover, .label-default, .label-default[href]:active, .label-default[href]:focus, .label-default[href]:hover, .label-info, .label-info[href]:active, .label-info[href]:focus, .label-info[href]:hover, .label-primary, .label-primary[href]:active, .label-primary[href]:focus, .label-primary[href]:hover, .label-success, .label-success[href]:active, .label-success[href]:focus, .label-success[href]:hover, .label-warning, .label-warning[href]:active, .label-warning[href]:focus, .label-warning[href]:hover {
    color: #000;
}
.alert-warning, .label-warning, .label-warning[href]:active, .label-warning[href]:focus, .label-warning[href]:hover, details.alert.alert-warning, details.alert[open].alert-warning {
    background: #f9f4d4;
    border-color: #f90;
}
.alert-success, .label-success, .label-success[href]:active, .label-success[href]:focus, .label-success[href]:hover, details.alert.alert-success, details.alert[open].alert-success {
    background: #d8eeca;
    border-color: #278400;
}
.alert, .label {
    border-radius: 0;
    border-style: solid;
    border-width: 0 0 0 4px;
}
.alert {
    padding: 15px;
    margin-bottom: 23px;
    border: 1px solid transparent;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}
ol, ul {
    margin-top: 0;
    margin-bottom: 11.5px;
}
span.mouseHover:hover {
	border: 1px solid black;
}
.c-checkbox {
	border-style: solid;
	border-width: thin;
	font-size: xx-small;
	font-weight: 900;
	margin-left: 15px;
	margin-right: 15px;
	padding-left: 2px;
	vertical-align: 2px;
}
span.normalWeight {
	font-weight: 100;
}
.padLeft3 {
	padding-left: 3px;
}
.nowrap {
	white-space: nowrap;
}
.lst-lwr-alph {
  list-style-type: lower-alpha; }
.minWidth150 {
	min-width: 150px;
}
.minWidth300 {
	min-width: 300px;
}
</xsl:text>
        </style>
      </head>
      <body>
        <xsl:if test="count(TRANSACTION_ENROL) &gt; 0">
          <xsl:apply-templates select="TRANSACTION_ENROL"></xsl:apply-templates>
        </xsl:if>
      </body>
    </html>
  </xsl:template>

  <!-- Transaction Enrolment -->
  <xsl:template match="TRANSACTION_ENROL">
    <h1>Master File Application Form
      <xsl:if test="software_version != ''">(Version: <xsl:value-of select="software_version"/>)
      </xsl:if>
    </h1>
    <div class="well well-sm">
      <table border="1" cellspacing="2" cellpadding="2" style="table-layout: fixed; width: 100%;word-wrap: break-word;">
        <tr>
          <th style="text-align: center;font-weight:bold;">Dossier Identifier</th>
          <th style="text-align: center;font-weight:bold;">Date Last Saved</th>
        </tr>
        <tr>
          <td style="text-align: center;">
            <span class="mouseHover normalWeight">
              <xsl:value-of select="ectd/dossier_id"/>
            </span>
          </td>
          <td style="text-align: center;">
            <span class="mouseHover normalWeight">
              <xsl:value-of select="substring(date_saved, 1, 10)"/>
            </span>
          </td>
        </tr>
      </table>
    </div>

    <section class="panel panel-primary mrgn-tp-lg">
      <header class="panel-heading clearfix">
        <h3 class="panel-title">Regulatory Information</h3>
      </header>
      <div class="panel-body">
        <div class="row">
          <div class="col-xs-12">
            <strong>Master File Name:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="ectd/product_name"/>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <strong>Master File Number:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="ectd/lifecycle_record/master_file_number"/>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <strong>Master File Type:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="ectd/lifecycle_record/regulatory_activity_type"/>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <strong>Master File Use:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="ectd/lifecycle_record/master_file_use"/>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <strong>Transaction Description:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="ectd/lifecycle_record/sequence_description_value"/>
            </span>
          </div>
        </div>
        <div class="row">
          <xsl:if test="ectd/lifecycle_record/sequence_from_date !=''">
            <div class="col-xs-6">
              <strong>Date:&#160;</strong>
              <span class="mouseHover normalWeight">
                <xsl:value-of select="ectd/lifecycle_record/sequence_from_date"/>
              </span>
            </div>
          </xsl:if>
          <xsl:if test="ectd/lifecycle_record/requester_of_solicited_information !=''">
            <div class="col-xs-6">
              <strong>Requester of solicited information:&#160;</strong>
              <span class="mouseHover normalWeight">
                <xsl:value-of select="ectd/lifecycle_record/requester_of_solicited_information"/>
              </span>
            </div>
          </xsl:if>
        </div>
      </div>
    </section>

    <section class="panel panel-primary mrgn-tp-lg">
      <header class="panel-heading clearfix">
        <h3 class="panel-title">Contact Information</h3>
      </header>
      <div class="panel-body">
        <section class="panel  panel-default">
          <header class="panel-heading clearfix">
            <h3 class="panel-title">Master File Holder Name and Address</h3>
          </header>
          <div class="panel-body">
            <xsl:call-template name="nameAddress">
              <xsl:with-param name="value" select="contact_info/holder_name_address"/>
            </xsl:call-template>
          </div>
        </section>
        <section class="panel  panel-default">
          <header class="panel-heading clearfix">
            <h3 class="panel-title">Master File Holder Contact</h3>
          </header>
          <div class="panel-body">
            <xsl:call-template name="contact">
              <xsl:with-param name="value" select="contact_info/holder_contact"/>
            </xsl:call-template>
          </div>
        </section>
        <section class="panel  panel-default">
          <header class="panel-heading clearfix">
            <h3 class="panel-title">Authorized Agent or Authorized Third Party Name and Address</h3>
          </header>
          <div class="panel-body">
            <xsl:if test="contact_info/agent_not_applicable = 'true'">
              <div class="row">
                <div class="col-xs-12">
                  <strong>
                    <xsl:call-template name="hp-checkbox">
                      <xsl:with-param name="value" select="contact_info/agent_not_applicable"/>
                    </xsl:call-template>
                    <span class="mouseHover normalWeight">Not applicable
                    </span>
                  </strong>
                </div>
              </div>
            </xsl:if>
            <xsl:if test="contact_info/agent_not_applicable = 'false'">
              <xsl:call-template name="nameAddress">
                <xsl:with-param name="value" select="contact_info/agent_name_address"/>
              </xsl:call-template>
            </xsl:if>
          </div>
        </section>
        <xsl:if test="contact_info/agent_not_applicable = 'false'">
          <section class="panel  panel-default">
            <header class="panel-heading clearfix">
              <h3 class="panel-title">Authorized Agent or Authorized Third Party Contact</h3>
            </header>
            <div class="panel-body">
              <xsl:call-template name="contact">
                <xsl:with-param name="value" select="contact_info/agent_contact"/>
              </xsl:call-template>
            </div>
          </section>
        </xsl:if>
        <div class="row">
          <div class="col-xs-12">
            <strong>
              <xsl:call-template name="hp-checkbox">
                <xsl:with-param name="value" select="contact_info/contact_info_confirm"/>
              </xsl:call-template>
              <span class="mouseHover normalWeight">I confirm that the above information is valid
              </span>
            </strong>
          </div>
        </div>
      </div>
    </section>
    <xsl:if test="fee_details != ''">
      <section class="panel panel-primary mrgn-tp-lg">
        <header class="panel-heading clearfix">
          <h3 class="panel-title">Master File Fees</h3>
        </header>
        <div class="panel-body">
          <div class="row">
            <div class="col-xs-12">
              <strong>Are there Letter(s) of Access being filed with this transaction? &#160;</strong>
              <xsl:call-template name="YesNoUnknow">
                <xsl:with-param name="value" select="fee_details/are_there_access_letters"/>
              </xsl:call-template>
            </div>
          </div>
          <xsl:if test="fee_details/number_of_access_letters != ''">
            <div class="row">
              <div class="col-xs-12">
                <strong>Number of Letter(s) of Access: &#160;</strong>
                <xsl:value-of select="fee_details/number_of_access_letters"/>
              </div>
            </div>
          </xsl:if>
          <div class="row">
            <div class="col-xs-12">
              <strong>Who is responsible for payment of fees? &#160;</strong>
              <xsl:choose>
                <xsl:when test=" 'AuthorizedMasterFileAgent' = fee_details/who_responsible_fee">
                  Authorized Master File Agent / Authorized Third Party
                </xsl:when>
                <xsl:when test=" 'MasterFileHolder' = fee_details/who_responsible_fee">
                  Master File Holder
                </xsl:when>
              </xsl:choose>
            </div>
          </div>
          <div class="row">
            <xsl:if test="fee_details/account_number != ''">
              <div class="col-xs-6">
                <strong>Customer/Client Account Number (if issued):&#160;</strong>
                <span class="mouseHover normalWeight">
                  <xsl:value-of select="fee_details/account_number"/>
                </span>
              </div>
            </xsl:if>
            <xsl:if test="fee_details/cra_business_number != ''">
              <div class="col-xs-6">
                <strong>Canada Revenue Agency Business Number (if applicable):&#160;</strong>
                <span class="mouseHover normalWeight">
                  <xsl:value-of select="fee_details/cra_business_number"/>
                </span>
              </div>
            </xsl:if>
          </div>
        </div>
      </section>
    </xsl:if>
    <section class="panel panel-primary mrgn-tp-lg">
      <header class="panel-heading clearfix">
        <h3 class="panel-title">Certification</h3>
      </header>
      <div class="panel-body">
        <div class="row">
          <strong>
            <xsl:call-template name="hp-checkbox">
              <xsl:with-param name="value" select="certify_accurate_complete"/>
            </xsl:call-template>
            <span class="mouseHover normalWeight">I certify that the information and material included in this Master
              File
              Application/Transaction is accurate and complete.
            </span>
          </strong>
        </div>
        <div class="row">
          <div class="col-xs-6">
            <strong>Full name:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="full_name"/>
            </span>
          </div>
          <div class="col-xs-6">
            <strong>Date:&#160;</strong>
            <span class="mouseHover normalWeight">
              <xsl:value-of select="submit_date"/>
            </span>
          </div>
        </div>
        <div class="row">
          <strong>
            <xsl:call-template name="hp-checkbox">
              <xsl:with-param name="value" select="consent_privacy"/>
            </xsl:call-template>
            <span class="mouseHover normalWeight">By submitting your personal information, you are consenting to its collection, use and disclosure in accordance with the Privacy Notice Statement. </span>
          </strong>
        </div>          
      </div>
    </section>
  </xsl:template>

  <xsl:template name="break">
    <xsl:param name="text" select="string(.)"/>
    <xsl:choose>
      <xsl:when test="contains($text, '&#xa;')">
        <xsl:value-of select="substring-before($text, '&#xa;')"/>
        <br/>
        <xsl:call-template name="break">
          <xsl:with-param name="text" select="substring-after($text, '&#xa;')"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="YesNoUnknow">
    <xsl:param name="value" select="/.."/>
    <xsl:choose>
      <xsl:when test="translate($value, $smallcase, $uppercase) = 'Y'">
        <xsl:value-of select="'Yes'"/>
      </xsl:when>
      <xsl:when test="translate($value, $smallcase, $uppercase) = 'N'">
        <xsl:value-of select="'No'"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="hp-checkbox">
    <xsl:param name="value" select="/.."/>
    <span class="c-checkbox">
      <xsl:choose>
        <xsl:when
          test="translate($value, $smallcase, $uppercase) = 'Y' or translate($value, $smallcase, $uppercase) = 'TRUE'">
          X
        </xsl:when>
        <xsl:otherwise>
          &#160;&#160;
        </xsl:otherwise>
      </xsl:choose>
    </span>
  </xsl:template>

  <xsl:template name="CapitalFirstLetter">
    <xsl:param name="value" select="/.."/>
    <xsl:value-of select="translate(substring($value,1,1), $smallcase, $uppercase)"/>
    <xsl:value-of select="translate(substring($value,2), $uppercase, $smallcase)"/>
  </xsl:template>

  <xsl:template name="nameAddress">
    <xsl:param name="value" select="/.."/>
    <div class="row">
      <div class="col-xs-12">
        <strong>Company Name:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/company_name"/>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <strong>Street Address:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/street_address"/>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <strong>City or Town:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/city"/>
        </span>
      </div>
      <div class="col-xs-6">
        <strong>Country:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/country"/>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <strong>Province or State:&#160;</strong>
          <xsl:if test="$value/province_lov != ''">
            <xsl:value-of select="$value/province_lov"/>
          </xsl:if>
          <xsl:if test="$value/province_text != ''">
            <xsl:value-of select="$value/province_text"/>
          </xsl:if>
      </div>
      <div class="col-xs-6">
        <strong>Postal Code:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/postal_code"/>
        </span>
      </div>
    </div>
  </xsl:template>

  <xsl:template name="contact">
    <xsl:param name="value" select="/.."/>
    <div class="row">
      <div class="col-xs-6">
        <strong>First Name:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/given_name"/>
        </span>
      </div>
      <div class="col-xs-6">
        <strong>Last Name:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/surname"/>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <strong>Language of Correspondence:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/language_correspondance"/>
        </span>
      </div>
      <div class="col-xs-6">
        <strong>Job Title:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/job_title"/>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <strong>Phone Number:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/phone_num"/>
        </span>
      </div>
      <div class="col-xs-6">
        <strong>Phone Extension:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/phone_ext"/>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <strong>Fax Number:&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/fax_num"/>
        </span>
      </div>
      <div class="col-xs-6">
        <strong>Email :&#160;</strong>
        <span class="mouseHover normalWeight">
          <xsl:value-of select="$value/email"/>
        </span>
      </div>
    </div>
  </xsl:template>

</xsl:transform>

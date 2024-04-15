<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
	<xsl:param name="language" select="'eng'"/>
	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'"/>
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
	<xsl:variable name="docRoot" select="/" />
	<xsl:template match="/">
		<html>
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=9"/>
				<style type="text/css">
@charset "utf-8";

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
.col-xs-5 {
	width:41.6666666667%
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
.out {
    display: none !important;
}

.nav a, a.btn {
    text-decoration: none;
}
				</style>
			</head>
            <body>
				<xsl:call-template name="mybody" />
			</body>
		</html>
	</xsl:template>
	
	<!-- Application Information Enrolment -->

	<xsl:template name="mybody">
		<h1>Regulatory Transaction Template: Regulatory Enrolment Process (REP) for Medical Devices (Version: 3.0)</h1>
		<div class="well well-sm" >
			<table border="1" cellspacing="2" cellpadding="2" style="table-layout: fixed; width: 100%;word-wrap: break-word;">
				<tr>
					<td style="text-align: center;font-weight:bold;">Dossier Type</td>
					<td style="text-align: center;font-weight:bold;">Dossier Identifier</td>
					<td style="text-align: center;font-weight:bold;">Date Generated</td>
				</tr>
				<tr>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/dossier_type/@label_en" /></span> </td>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:apply-templates select="/descendant-or-self::application_info/dossier_id" /></span> </td>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:call-template name="lastDate"><xsl:with-param name="date" select="/descendant-or-self::application_info/last_saved_date" /></xsl:call-template></span> </td>
				</tr>
			</table>
		</div>
		<section>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Regulatory Transaction Enrolment</h2>
				</div>
				<div class="panel-body">
					<section class="panel panel-default" >
							<div class="panel-body">
								<div class="row">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<strong>Dossier Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/dossier_id"/></span>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Manufacturer Company Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/company_id"/></span>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Regulatory Company Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_company_id"/></span>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Manufacturer Contact Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/manufacturer_contact_id"/></span>
									</div>

									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Regulatory Contact Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_contact_id"/></span>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Regulatory Activity Type:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_activity_type/@label_en"/></span>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Transaction Description:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/description_type/@label_en"/></span>
									</div>
								</div>
								<xsl:if test="/descendant-or-self::application_info/device_class != ''">
									<div class="row">
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<strong>Device Class:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/device_class/@label_en"/></span>
										</div>
									</div>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/amend_reasons/amend_reason">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><strong>Reason for filing this Amendment</strong></div>
									</div>
									<xsl:for-each select="/descendant-or-self::application_info/amend_reasons/amend_reason">
										<div class="row">
											<div class="col-xs-12">
												<span class="mouseHover"><xsl:value-of select="@label_en"/></span>
											</div>
										</div>
									</xsl:for-each>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/rationale != ''">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<strong>Rationale:</strong>
										</div>
									</div>
									<div class="row">
										<div class="ccol-lg-12 col-md-12 col-sm-12 col-xs-12">
											<xsl:value-of select="/descendant-or-self::application_info/rationale"/>
										</div>
									</div>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/proposed_indication != ''">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<strong>Proposed Purpose/Indication for Use:</strong>
										</div>
									</div>
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<xsl:value-of select="/descendant-or-self::application_info/proposed_indication"/>
										</div>
									</div>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/proposed_licence_name != ''">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<strong>Proposed licence name:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/proposed_licence_name"/></span>
										</div>
									</div>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/request_date != ''">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<strong>Date of Request:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/request_date"/></span>
										</div>
									</div>
								</xsl:if>
								<div class="row">
									<xsl:if test="/descendant-or-self::application_info/application_number != ''">
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<strong>Application Number:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/application_number"/></span>
										</div>
									</xsl:if>
									<xsl:if test="/descendant-or-self::application_info/description_type/@id = 'MM'">
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<strong>Meeting Identifier:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/meeting_id"/></span>
										</div>
								</xsl:if>
								</div>
								<xsl:if test="/descendant-or-self::application_info/device_name != ''">
									<div class="row">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<strong>Name of Device, as it appears on the labele:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/device_name"/></span>
										</div>
									</div>
								</xsl:if>
								<div class="row">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<strong>Licence number:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/licence_number"/></span>
									</div>
								</div>
								<xsl:if test="/descendant-or-self::application_info/org_manufacture_id != ''">
									<div class="row">
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<strong>Original Manufacturer's Company Identifier:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/org_manufacture_id"/></span>
										</div>
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<strong>Original Manufacturer's Licence Number:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/org_manufacture_lic"/></span>
										</div>
									</div>
								</xsl:if>
								<div class="row">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<strong>Device details table included?&#160;</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/has_ddt"/></xsl:call-template></span>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="/descendant-or-self::application_info/has_app_info"/></xsl:call-template>
										<span class="mouseHover">
											<strong>Application information XML included in transaction?</strong>
										</span>
									</div>
								</div>
							</div>
					</section>
					<section class="panel panel-default" >
						<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
							<h3 class="panel-title">Fees</h3>
						</div>
						<div class="panel-body">
							<div class="row">
								<div class="col-xs-12">
									<strong>Are new fees or revised fees associated with this transactions? &#160;</strong>
									<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::transFees/has_fees"/></xsl:call-template></span>
								</div>
							</div>
							<xsl:if test="/descendant-or-self::transFees/has_fees = 'yes'">
								<div class="row">
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Billing Company Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::transFees/billing_company_id"/></span>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<strong>Billing Contact Identifier:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::transFees/billing_contact_id"/></span>
									</div>
								</div>
							</xsl:if>
						</div>
					</section>
				</div>
			</div>
		</section>
	</xsl:template>
	<xsl:template name="YesNoUnknow">
		<xsl:param name="value" select="/.."/>
		<xsl:choose>
		<xsl:when test="translate($value, $smallcase, $uppercase) = 'YES'">Yes</xsl:when>
		<xsl:when test="translate($value, $smallcase, $uppercase) = 'NO'">No</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="hp-checkbox">
		<xsl:param name="value" select="/.."/>
		<span class="c-checkbox">
		<xsl:choose>
			<xsl:when test="$value = 'true'">X </xsl:when>
			<xsl:otherwise>&#160;&#160;</xsl:otherwise>
		</xsl:choose>
		</span>
	</xsl:template>
	<xsl:template name="lastDate">
		<xsl:param name="date" select="/.."/>
		<xsl:value-of select="substring($date, 1, 10)"/>
		<xsl:value-of select="' '"/>
		<xsl:value-of select="substring($date,12,2)"/>
		<xsl:value-of select="':'"/>
		<xsl:value-of select="substring($date, 14)"/>
	</xsl:template>
</xsl:stylesheet>

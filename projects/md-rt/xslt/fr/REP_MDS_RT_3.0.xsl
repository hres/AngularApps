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
					<td style="text-align: center;font-weight:bold;">Type de dossier</td>
					<td style="text-align: center;font-weight:bold;">Numéro de dossier</td>
					<td style="text-align: center;font-weight:bold;">Date Last Saved_fr</td>
				</tr>
				<tr>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/dossier_type" /></span> </td>
					<td style="text-align: center;"> <span class="mouseHover">HC6-024-<xsl:apply-templates select="/descendant-or-self::application_info/dossier_id" /></span> </td>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:call-template name="lastDate"><xsl:with-param name="date" select="/descendant-or-self::application_info/last_saved_date" /></xsl:call-template></span> </td>
				</tr>
			</table>
		</div>
		<section>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Regulatory Transaction Information_fr</h2>
				</div>
				<div class="panel-body">
					<section class="panel panel-default" >
							<div class="panel-body">
								<div class="row">
									<div class="col-xs-6">
										<strong>Numéro d’identification du fabricant:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/company_id"/></span>
									</div>
									<div class="col-xs-5">
										<strong>Identificateur du contact du fabricant:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/manufacturing_contact_id"/></span>
									</div>
									<div class="col-xs-6">
										<strong>Identifiant de la compagnie de réglementation:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_company_id"/></span>
									</div>
									<div class="col-xs-5">
										<strong>Identificateur du contact réglementaire:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_contact_id"/></span>
									</div>
									<div class="col-xs-6">
										<strong>Responsable de l’activité réglementaire:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_activity_lead"/></span>
									</div>
									<div class="col-xs-5">
										<strong>Type d'activité:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_activity_type"/></span>
									</div>
									<div class="col-xs-6">
										<strong>Description de la transaction:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/transaction_description"/></span>
									</div>
									<xsl:if test="/descendant-or-self::application_info/device_class != ''">
										<div class="col-xs-6">
											<strong>Catégorie d'instruments:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/device_class"/></span>
										</div>
									</xsl:if>
								</div>
								<xsl:if test="count(/descendant-or-self::application_info/amend_reasons/*[. = 'yes']) > 0">
									<div class="row">&#160;</div>
									<div class="row">
										<div class="col-xs-12"><strong>Raison du dépôt de cet amendement</strong></div>
									</div>
									<div class="row">
										<xsl:for-each select="/descendant-or-self::application_info/amend_reasons/*">
											<xsl:if test=". = 'yes'">
												<div class="col-xs-5">
													<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="current()"/></xsl:call-template>
													<span class="mouseHover">
														<xsl:call-template name="converter"><xsl:with-param name="value" select="name()"/></xsl:call-template>
													</span>
												</div>
												<xsl:if test=". = 'other_change'">
													<div class="col-xs-12">
														<strong>Other details:_fr</strong>
													</div>
													<div class="col-xs-12">
														<xsl:value-of select="/descendant-or-self::application_info/amend_reasons/other_details"/>
													</div>
												</xsl:if>
											</xsl:if>
										</xsl:for-each>
									</div>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/rationale != ''">
									<div class="row">
										<div class="col-xs-12">
											<strong>Raisonnement:</strong>
										</div>
										<div class="col-xs-11">
											<xsl:value-of select="/descendant-or-self::application_info/rationale"/>
										</div>
									</div>
								</xsl:if>
								<div class="row">
									<xsl:if test="/descendant-or-self::application_info/proposed_licence_name != ''">
										<div class="col-xs-6">
											<strong>Nom proposé pour la licence:&#160;<br/></strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/proposed_licence_name"/></span>
										</div>
									</xsl:if>
									<xsl:if test="/descendant-or-self::application_info/application_number != ''">
										<div class="col-xs-6">
											<strong>Numéro de la demande:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/application_number"/></span>
										</div>
									</xsl:if>
									<xsl:if test="/descendant-or-self::application_info/device_name != ''">
										<div class="col-xs-6">
											<strong>Nom de l'appareil:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/device_name"/></span>
										</div>
									</xsl:if>
									<xsl:if test="/descendant-or-self::application_info/description_type/@id = 'MM'">
										<div class="col-xs-6">
											<strong>Identifiant de la réunion:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/meeting_id"/></span>
										</div>
									</xsl:if>
									<xsl:if test="/descendant-or-self::application_info/brief_description != ''">
										<div class="col-xs-6">
											<strong>Brief Description:&#160;_fr</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/brief_description"/></span>
										</div>
									</xsl:if>
									<xsl:if test="/descendant-or-self::application_info/proposed_indication != ''">
										<div class="col-xs-12">
											<strong>Objectif proposé / indication d'utilisation:&#160;</strong>
											<div class="col-xs-12">
												<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/proposed_indication"/></span>
											</div>
										</div>
									</xsl:if>
									<div class="col-xs-12">
										<strong>Numéro de licence:&#160;</strong>
										<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/licence_number"/></span>
									</div>
									<xsl:if test="/descendant-or-self::application_info/org_manufacture_id != ''">
										<div class="col-xs-6">
											<strong>Identifiant de l'entreprise du fabricant d'origine:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/org_manufacture_id"/></span>
										</div>
										<div class="col-xs-6">
											<strong>Numéro de licence du fabricant d'origine:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/org_manufacture_lic"/></span>
										</div>
									</xsl:if>
									<div class="col-xs-5">
										<strong>Tableau des détails de l'instrument inclus?&#160;</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/has_ddt"/></xsl:call-template></span>
									</div>
									<div class="col-xs-5">
										<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="/descendant-or-self::application_info/has_app_info"/></xsl:call-template>
										<span class="mouseHover">
											<strong>Informations sur la demande XML inclus dans la transaction?</strong>
										</span>
									</div>
									
								</div>
							</div>
					</section>
					<section class="panel panel-default" >
						<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
							<h3 class="panel-title">Frais</h3>
						</div>
						<div class="panel-body">
							<div class="row">
								<div class="col-xs-12">
									<strong>De nouveaux frais ou des frais révisés sont-ils associés à cette transaction?&#160;</strong>
									<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::transFees/has_fees"/></xsl:call-template></span>
								</div>
								<xsl:if test="/descendant-or-self::transFees/has_fees = 'yes'">
								<div class="col-xs-6">
									<strong>Identifiant de l'entreprise de facturation:&#160;</strong>
									<span class="mouseHover"><xsl:value-of select="/descendant-or-self::transFees/billing_company_id"/></span>
								</div>
								<div class="col-xs-5">
									<strong>Identifiant du contact de facturation:&#160;</strong>
									<span class="mouseHover"><xsl:value-of select="/descendant-or-self::transFees/billing_contact_id"/></span>
								</div>
								<div class="col-xs-12">
									<div class="alert alert-info">
										Un formulaire de frais complété est toujours requis, cependant, les frais applicables seront facturés.
									</div>
								</div>
								</xsl:if>
							</div>
						</div>
					</section>
				</div>
			</div>
		</section>
	</xsl:template>
	<xsl:template name="YesNoUnknow">
		<xsl:param name="value" select="/.."/>
		<xsl:choose>
		<xsl:when test="$value = 'yes'">Oui</xsl:when>
		<xsl:when test="$value = 'no'">Non</xsl:when>
		<xsl:otherwise>Unknown_fr</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="getLabel">
		<xsl:param name="node" select="/.."/>
		<xsl:choose>
		<xsl:when test="$language = 'fra'">
			<xsl:value-of select="$node/@label_fr"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$node/@label_en"/>
		</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="hp-checkbox">
		<xsl:param name="value" select="/.."/>
		<span class="c-checkbox">
		<xsl:choose>
			<xsl:when test="$value = 'yes'">X </xsl:when>
			<xsl:otherwise>&#160;&#160;</xsl:otherwise>
		</xsl:choose>
		</span>
	</xsl:template>
	<xsl:template name="CapitalFirstLetter">
		<xsl:param name="value" select="/.."/>
		<xsl:value-of select="translate(substring($value,1,1), $smallcase, $uppercase)"/>
		<xsl:value-of select="translate(substring($value,2), $uppercase, $smallcase)"/>
	</xsl:template>
	<xsl:template name="converter">
		<xsl:param name="value" select="/.."/>
		<xsl:choose>
			<xsl:when test=" 'classification_change' = $value">
				<xsl:value-of select="'Modification de la classification de l’instrument'"/>
			</xsl:when>
			<xsl:when test=" 'licence_change' = $value">
				<xsl:value-of select="'Changement du nom de la licence'"/>
			</xsl:when>
			<xsl:when test=" 'process_change' = $value">
				<xsl:value-of select="'Significant change in manufacturing process, facility of equipment'"/>
			</xsl:when>
			<xsl:when test=" 'quality_change' = $value">
				<xsl:value-of select="'Modification importante du processus, des installations ou du matériel de fabrication'"/>
			</xsl:when>
			<xsl:when test=" 'design_change' = $value">
				<xsl:value-of select="'Modification importante des exigences de conception ou de
performance'"/>
			</xsl:when>
			<xsl:when test=" 'materials_change' = $value">
				<xsl:value-of select="'Modification importante des matériaux utilisés'"/>
			</xsl:when>
			<xsl:when test=" 'labelling_change' = $value">
				<xsl:value-of select="'Modification importante de l’étiquetage de l’instrument'"/>
			</xsl:when>
			<xsl:when test=" 'safety_change' = $value">
				<xsl:value-of select="'Toute modification qui pourrait avoir une incidence sur la
sûreté et l’efficacité de l’instrument'"/>
			</xsl:when>
			<xsl:when test=" 'purpose_change' = $value">
				<xsl:value-of select="'Modification de l'objectif / de l'indication d'un instrument'"/>
			</xsl:when>
			<xsl:when test=" 'add_delete_change' = $value">
				<xsl:value-of select="'Ajout / Suppression'"/>
			</xsl:when>
			<xsl:when test=" 'device_change' = $value">
				<xsl:value-of select="'Changement du nom de l'instrument'"/>
			</xsl:when>
			<xsl:when test=" 'manufacturer_address_change' = $value">
				<xsl:value-of select="'Manufacturer address change'"/>
			</xsl:when>
			<xsl:when test=" 'facility_change' = $value">
				<xsl:value-of select="'Facility change'"/>
			</xsl:when>
			<xsl:when test=" 'other_change' = $value">
				<xsl:value-of select="'Other change'"/>
			</xsl:when>

			<xsl:otherwise>
				<xsl:value-of select="$value"/>
			</xsl:otherwise>
		</xsl:choose>
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

<!-- Stylus Studio meta-information - (c) 2004-2009. Progress Software Corporation. All rights reserved.

<metaInformation>
	<scenarios>
		<scenario default="yes" name="Scenario1" userelativepaths="no" externalpreview="yes" url="file:///c:/Users/hcuser/Downloads/rt-m543434-2020-03-18-1137 (1).xml" htmlbaseurl="" outputurl="file:///c:/SPM/test/TRANSACTION.html" processortype="saxon8"
		          useresolver="yes" profilemode="0" profiledepth="" profilelength="" urlprofilexml="" commandline="" additionalpath="" additionalclasspath="" postprocessortype="none" postprocesscommandline="" postprocessadditionalpath=""
		          postprocessgeneratedext="" validateoutput="no" validator="internal" customvalidator="">
			<advancedProp name="sInitialMode" value=""/>
			<advancedProp name="schemaCache" value="||"/>
			<advancedProp name="bXsltOneIsOkay" value="true"/>
			<advancedProp name="bSchemaAware" value="true"/>
			<advancedProp name="bGenerateByteCode" value="true"/>
			<advancedProp name="bXml11" value="false"/>
			<advancedProp name="iValidation" value="0"/>
			<advancedProp name="bExtensions" value="true"/>
			<advancedProp name="iWhitespace" value="0"/>
			<advancedProp name="sInitialTemplate" value=""/>
			<advancedProp name="bTinyTree" value="true"/>
			<advancedProp name="xsltVersion" value="2.0"/>
			<advancedProp name="bWarnings" value="true"/>
			<advancedProp name="bUseDTD" value="false"/>
			<advancedProp name="iErrorHandling" value="fatal"/>
		</scenario>
	</scenarios>
	<MapperMetaTag>
		<MapperInfo srcSchemaPathIsRelative="yes" srcSchemaInterpretAsXML="no" destSchemaPath="" destSchemaRoot="" destSchemaPathIsRelative="yes" destSchemaInterpretAsXML="no"/>
		<MapperBlockPosition></MapperBlockPosition>
		<TemplateContext></TemplateContext>
		<MapperFilter side="source"></MapperFilter>
	</MapperMetaTag>
</metaInformation>
-->
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
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
		<h1>Modèle d’information sur les demandes d’homologation: Processus d'inscription réglementaire (PIR) pour les instruments médicaux (Version 3.0.0)</h1>
		<div class="well well-sm" >
			<table border="1" cellspacing="2" cellpadding="2" style="table-layout: fixed; width: 100%;word-wrap: break-word;">
				<tr>
					<td style="text-align: center;font-weight:bold;">Identifiant de la compagnie du fabricant</td>
					<td style="text-align: center;font-weight:bold;">Numéro de dossier</td>
					<td style="text-align: center;font-weight:bold;">Date de la dernière enregistrement</td>
				</tr>
				<tr>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/company_id" /></span> </td>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/dossier_id" /></span> </td>
					<td style="text-align: center;"> <span class="mouseHover"><xsl:call-template name="lastDate"><xsl:with-param name="date" select="/descendant-or-self::application_info/last_saved_date" /></xsl:call-template></span> </td>
				</tr>
			</table>
		</div>
		<section>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Information sur le demande d’homologation</h2>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-xs-6">
							<strong>Numéro de certificat du Programme d’audit unique des matériels médicaux (PAUMM):&#160;</strong>
							<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/mdsap_number" /></span>
						</div>					
						<div class="col-xs-12">
							<strong>Programme d’audit unique des matériels médicaux (PAUMM) Organisation d'audit:&#160;</strong>
							<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/mdsap_org/@label_fr"/></span>
						</div>
						<div class="col-xs-6">
							<strong>Type de demande d'homologation:&#160;</strong>
							<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/licence_application_type/@label_fr"/></span>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-6">
							<strong>Type d'activité réglementaire:&#160;</strong>
							<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/regulatory_activity_type/@label_fr"/></span>
						</div>
						<div class="col-xs-6">
							<strong>Catégorie d'instruments:&#160;</strong>
							<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/device_class/@label_fr"/></span>
						</div>
					</div>
					<div class="row"><br/></div>
					<section class="panel panel-default" >
						<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
							<h2 class="panel-title">Lieu d'utilisation</h2>
						</div>
							<div class="panel-body">
								<div class="row">&#160;
									<strong>Cet instrument est-il un  instrument de diagnostique in vitro (IDIV)?&#160;</strong>
									<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/is_ivdd"/></xsl:call-template></span>
								</div>
								<xsl:choose>
								<xsl:when test="/descendant-or-self::application_info/is_ivdd = 'yes'">
									<div class="row">&#160;
										<strong>Est-ce vendu pour un usage domestique?&#160;</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/is_home_use"/></xsl:call-template></span>
									</div>
									<div class="row">&#160;
										<strong>Cet instrumentl est-il utilisé dans un lieu de soins, comme une pharmacie, un chevet ou un bureau d'un professionnel de la santé?&#160;</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/is_care_point_use"/></xsl:call-template></span>
									</div>
									<div class="row">&#160;
										<strong>Est-ce que certains des instruments contenus dans cette application émettent des radiations?</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/is_emit_radiation"/></xsl:call-template></span>
									</div>
								</xsl:when>
								<xsl:otherwise>
									<div class="row">&#160;
										<strong>Est-ce que certains des instruments contenus dans cette application émettent des radiations?</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/is_emit_radiation"/></xsl:call-template></span>
									</div>
									<div class="row">&#160;
										<strong>Est-ce que cet instrument contient un médicament?&#160;</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/has_drug"/></xsl:call-template></span>
									</div>
									<xsl:if test="/descendant-or-self::application_info/has_drug = 'yes'">
										<div class="row">&#160;
											<strong>Le médicament a-t-il un numéro d'identification de médicament (DIN) ou un numéro de produit naturel (NPN):&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/has_din_npn"/></span>
										</div>
									</xsl:if>
									<xsl:choose>
									<xsl:when test="/descendant-or-self::application_info/has_din_npn/@id = 'din'">
										<div class="row">&#160;
											<strong>Numéro d'identification du médicament (DIN):&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/din"/></span>
										</div>
									</xsl:when>
									<xsl:when test="/descendant-or-self::application_info/has_din_npn/@id = 'npn'">
										<div class="row">&#160;
											<strong>Numéro de produit naturel (NPN):&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/npn"/></span>
										</div>
									</xsl:when>
									</xsl:choose>
									<xsl:if test="/descendant-or-self::application_info/has_drug = 'yes'">
										<div class="row">&#160;
											<strong>Marque / nom commercial du médicament:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/drug_name"/></span>
										</div>
										<div class="row">&#160;
											<strong>Ingrédient(s) actif(s):&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/active_ingredients"/></span>
										</div>
										<div class="row">&#160;
											<strong>Fabricant:&#160;</strong>
											<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/manufacturer"/></span>
										</div>
										<div class="row">&#160;
											<strong>Conformité:&#160;</strong>
										</div>
										<xsl:for-each select="/descendant-or-self::application_info/compliance/compliance">
												<div class="row">
													<div class="col-xs-12">
														<span class="mouseHover"><xsl:value-of select="@label_fr"/></span>
													</div>
												</div>
										</xsl:for-each>	
										<xsl:if test="/descendant-or-self::application_info/other_pharmacopeia !=''">
											<div class="row">&#160;
												<strong>Indiquer une autre pharmacopée :&#160;</strong>
												<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/other_pharmacopeia"/></span>
											</div>
										</xsl:if>
									</xsl:if>
								</xsl:otherwise>
								</xsl:choose>
							</div>
					</section>
					<section class="panel panel-default" >
						<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
							<h2 class="panel-title">Historique de l'instrument</h2>
						</div>
						<div class="panel-body">
							<div class="row">
								<div class="col-xs-6">
								<strong>La vente de cet instrument a-t-elle déjà été autorisée au Canada en vertu des dispositions du Règlement sur les instruments médicaux:</strong>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-6">
									<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="/descendant-or-self::application_info/provision_mdr_it"/></xsl:call-template>
									<span class="mouseHover">Test expérimental</span>
								</div>
								<xsl:if test="/descendant-or-self::application_info/provision_mdr_it = 'true'">
								<div class="col-xs-6">
									<strong>Numéro d'application:&#160;</strong>
									<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/application_number"/></span>
								</div>
								</xsl:if>
							</div>
							<div class="row">
								<div class="col-xs-6">
									<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="/descendant-or-self::application_info/provision_mdr_sa"/></xsl:call-template>
									<span class="mouseHover">Accès spécial</span>
								</div>
								<xsl:if test="/descendant-or-self::application_info/provision_mdr_it = 'no' and /descendant-or-self::application_info/provision_mdr_sa = 'yes'">
									<div class="col-xs-6">&#160;</div>
								</xsl:if>
								<xsl:if test="/descendant-or-self::application_info/provision_mdr_sa = 'true'">
								<div class="col-xs-6">
									<strong>Numéro de demande PAS:&#160;</strong>
									<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/sap_request_number"/></span>
								</div>
								</xsl:if>
							</div>
							<div class="row">
								<div class="col-xs-6">
									<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="/descendant-or-self::application_info/interim_order_authorization"/></xsl:call-template>
									<span class="mouseHover">Autorisation délivrée au titre de l'arrêté d'urgence</span>
								</div>
								<xsl:if test="/descendant-or-self::application_info/interim_order_authorization = 'true'">
								<div class="col-xs-6">
									<strong>ID d'autorisation:&#160;</strong>
									<span class="mouseHover"><xsl:value-of select="/descendant-or-self::application_info/authorization_id"/></span>
								</div>
								</xsl:if>		
								<xsl:if test="/descendant-or-self::application_info/provision_mdr_it = 'no' and /descendant-or-self::application_info/provision_mdr_sa = 'yes'">
									<div class="col-xs-6">&#160;</div>
								</xsl:if>
							</div>
						</div>
					</section>
					<xsl:if test="count(/descendant-or-self::devices/device/id) > 0">
						<section class="panel panel-default" >
							<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
								<h2 class="panel-title">Compatibilité des instruments interdépendants</h2>
							</div>
							<div class="panel-body">
								<xsl:call-template name="compatibleDevices"><xsl:with-param name="values" select="/descendant-or-self::devices"/></xsl:call-template>
							</div>
						</section>
					</xsl:if>
					<xsl:if test="/descendant-or-self::application_info/declaration_conformity != ''">
						<section class="panel panel-default" >
							<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
								<h2 class="panel-title">Normes reconnues respectées dans la fabrication de l'instrument</h2>
							</div>
							<div class="panel-body">
								<div class="row">
									<div class="col-xs-12">
									<strong>Le formulaire de déclaration de conformité (disponible sur le site Web de Santé Canada) confirme que le ou les instruments médicaux sont conformes aux normes reconnues ou à des normes équivalentes ou supérieures:&#160;</strong>
									<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::application_info/declaration_conformity"/></xsl:call-template></span>
									</div>
								</div>
							</div>
						</section>
					</xsl:if>
					<xsl:if test="/descendant-or-self::application_info/device_class/@id = 'DC4'">
						<section class="panel panel-default" >
							<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
								<h2 class="panel-title">Instruments contenant du matériel biologique</h2>
							</div>
							<div class="panel-body">
								<div class="row">
									<div class="col-xs-12">
									<strong>Cet instrument est-il constitué de matériel recombinant?&#160;</strong>
									<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::material_info/has_recombinant"/></xsl:call-template></span>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-12">
									<strong>Cet instrument contient-il ou est-il produit à l'aide de matériel d'origine animale ou humaine?&#160;</strong>
									<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::material_info/is_animal_human_sourced"/></xsl:call-template></span>
									</div>
								</div>
								<xsl:if test="/descendant-or-self::material_info/is_animal_human_sourced = 'yes'">
									<div class="row">
									<div class="col-xs-12">
										<strong>Le matériel biologique est-il le même pour tous les instruments répertoriés dans le fichier Excel de détails de l'instrument? &#160;</strong>
										<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::material_info/is_listed_idd_table"/></xsl:call-template></span>
									</div>
									</div>
								</xsl:if>
								<xsl:if test="count(/descendant-or-self::material_info/biological_materials/material/id) > 0">
									<section class="panel panel-default" >
										<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
											<h2 class="panel-title">Tableau des attributs des matériels biologiques</h2>
										</div>
										<div class="panel-body">
											<xsl:apply-templates select="/descendant-or-self::material_info/biological_materials/material"/>
										</div>
									</section>
								</xsl:if>
							</div>
						</section>
					</xsl:if>				
					<section class="panel panel-default" >
						<div class="panel-heading"  style="color:#030303; background-color:#f8f8f8;">
							<h2 class="panel-title">Examen prioritaire</h2>
						</div>
						<div class="panel-body">
							<div class="row">
								<div class="col-xs-12">
								<strong>Un examen prioritaire est-il demandé pour cette application?&#160;</strong>
								<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="/descendant-or-self::priority_review/priority_review"/></xsl:call-template></span>
								</div>
							</div>
							
							<xsl:if test="/descendant-or-self::priority_review/priority_review = 'yes'">
								<div class="row">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><strong>Un examen prioritaire est demandé pour l’instrument en question, car il est destiné au diagnostic ou au traitement d'une maladie ou d'une affection grave, mettant la vie de l'individu en danger ou gravement débilitante, et il existe des preuves cliniques substantielles que l'instrument médical :</strong></div>
								</div>
								<xsl:for-each select="/descendant-or-self::priority_review/is_diagnosis_treatment_serious/diagnosis_reason">
									<div class="row">
										<div class="col-xs-12">
											<span class="mouseHover"><xsl:value-of select="@label_fr"/></span>
										</div>
									</div>
								</xsl:for-each>
							</xsl:if>
						</div>
					</section>			
				</div>
			</div>
		</section>
	</xsl:template>
	<xsl:template name="biologicMaterial" match="material_info/biological_materials/material">
		
		<h4>Matériel biologique &#160;<xsl:value-of select="position()"/></h4>
		<div class="col-xs-12">
		<div class="row">
			<div class="col-xs-12">
			<strong>Nom du matériel:&#160;</strong>
			<span class="mouseHover"><xsl:value-of select="./material_name"/></span>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
			<strong>Nom de l'instrument compatible:&#160;</strong>
			<span class="mouseHover"><xsl:value-of select="./device_name"/></span>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-5">
				<strong>Pays d'origine (pour animaux seulement):&#160;</strong>
				<span class="mouseHover"><xsl:value-of select="./origin_country/@label_fr"/></span>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-5">
				<strong>Famille de l'espèce:&#160;</strong>
				<span class="mouseHover"><xsl:value-of select="./family_of_species/@label_fr"/></span>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-5">
				<strong>Type de tissus/substances:&#160;</strong>
				<span class="mouseHover"><xsl:value-of select="./tissue_substance_type/@label_fr"/></span>
			</div>
			<xsl:if test="./tissue_substance_type/@id = '32'">
				<div class="col-xs-5">
					<strong>Autres détails sur les types de tissus:&#160;</strong>
					<span class="mouseHover"><xsl:value-of select="./tissue_type_other_details"/></span>
				</div>
			</xsl:if>
			<xsl:if test="./tissue_substance_type/@id != 'other' and ./derivative/@id = 'other'">
				<div class="col-xs-5">&#160;</div>
			</xsl:if>
		</div>
		<div class="row">
			<div class="col-xs-5">
				<strong>Dérivé:&#160;</strong>
				<span class="mouseHover"><xsl:value-of select="./derivative/@label_fr"/></span>
			</div>
			<xsl:if test="./derivative/@id = '30'">
				<div class="col-xs-5">
					<strong>Autres détails sur les dérivés:&#160;</strong>
					<span class="mouseHover"><xsl:value-of select="./derivative_other_details"/></span>
				</div>
			</xsl:if>
		</div>
		<div class="row"><br/><hr /><br/></div>
		</div>
		<!--<div class="row"><hr /></div>-->
		
	</xsl:template>
	<xsl:template name="compatibleDevices">
		<xsl:param name="values" select="/.." />
		<xsl:for-each select="$values/device">
			<h4>Instruments interdépendants&#160;<xsl:value-of select="position()"/></h4>
			<div class="col-xs-12">
			<div class="row">
				<div class="col-xs-12">
				<strong>Nom de l'instrument compatible:&#160;</strong>
				<span class="mouseHover"><xsl:value-of select="./device_name"/></span>
				</div>
				<div class="col-xs-12">
					<strong>Cet instrument a-t-il été autorisé par Santé Canada?&#160;</strong>
					<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="./device_authorized"/></xsl:call-template></span>

				</div>
			</div>
			<div class="row">
				<div class="col-xs-6">
					<xsl:choose>
					<xsl:when test="device_authorized = 'yes'">
						<strong>Numéro de licence:&#160;</strong>
						<span class="mouseHover"><xsl:value-of select="./licence_number"/></span>
					</xsl:when>
					<xsl:otherwise>
						<strong>Une demande a-t-elle déjà été soumise pour cet instrument?&#160;</strong>
						<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="./device_application_submitted"/></xsl:call-template></span>
						<br/>
						<xsl:choose>
						<xsl:when test="device_application_submitted = 'yes'">
							<strong>Numéro d'application:&#160;</strong>
							<span class="mouseHover"><xsl:value-of select="./device_application_number"/></span>
						</xsl:when>
						<xsl:otherwise>
							<strong>Veuillez expliquer:&#160;</strong>
							<div class="col-xs-11">
							<span class="mouseHover"><xsl:value-of select="./device_explain"/></span>
							</div>
						</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>
			<div class="row"><br/><hr /><br/></div>
			</div>
			<!--<div class="row"><hr /></div>-->
		</xsl:for-each>
	</xsl:template>
	<xsl:template name="YesNoUnknow">
		<xsl:param name="value" select="/.."/>
		<xsl:choose>
		<xsl:when test="$value = 'yes'">Oui</xsl:when>
		<xsl:when test="$value = 'no'">Non</xsl:when>
		<xsl:otherwise>Unknown</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="hp-checkbox">
		<xsl:param name="value" select="/.."/>
		<span class="c-checkbox">
		<xsl:choose>
			<xsl:when test="$value = 'true'">
				X
			</xsl:when>
			<xsl:otherwise>
				&#160;&#160;
			</xsl:otherwise>
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

					<!-- Stylus Studio meta-information - (c) 2004-2009. Progress Software Corporation. All rights reserved.

<metaInformation>
	<scenarios>
		<scenario default="yes" name="Scenario1" userelativepaths="yes" externalpreview="yes" url="..\..\..\..\..\Downloads\ai-m333333-2020-03-31-0757.xml" htmlbaseurl="" outputurl="..\..\..\..\..\..\..\SPM\test\mds_appInfo.html" processortype="saxon8"
		          useresolver="yes" profilemode="0" profiledepth="" profilelength="" urlprofilexml="" commandline="" additionalpath="" additionalclasspath="" postprocessortype="none" postprocesscommandline="" postprocessadditionalpath=""
		          postprocessgeneratedext="" validateoutput="no" validator="internal" customvalidator="">
			<parameterValue name="cssFile" value="'file:///C:/Users/hcuser/git/XSLT/Medical-Device-REP/v_1_0/Style-Sheets/ip400-1.css'"/>
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
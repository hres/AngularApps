<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xsl:param name="language" select="'eng'"/>
	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'"/>
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
	<xsl:decimal-format name="FrenchDecimalFormat" decimal-separator="," grouping-separator="&#160;"/>
	<xsl:template match="/">
		<html>
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=9"/>
				<style type="text/css">
<xsl:text disable-output-escaping="yes" >
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
				<xsl:if test="count(TRANSACTION_ENROL) &gt; 0"> <xsl:apply-templates select="TRANSACTION_ENROL"></xsl:apply-templates> </xsl:if>
			</body>
		</html>
	</xsl:template>
	
	<!-- Transaction Enrolment -->
	<xsl:template match="TRANSACTION_ENROL">
		<h1>Mod&#232;le de transaction r&#233;glementaire: Processus d'inscription r&#233;glementaire (PIR)<xsl:if test="software_version != ''"> (Version: <xsl:value-of select="software_version"/>)</xsl:if></h1>
					<div class="well well-sm" >
						<table border="1" cellspacing="2" cellpadding="2" style="table-layout: fixed; width: 100%;word-wrap: break-word;">
							<tr>
								<th style="text-align: center;font-weight:bold;">Numéro de la compagnie</th>
								<th style="text-align: center;font-weight:bold;">Type de dossier</th>
								<th style="text-align: center;font-weight:bold;">Numéro de dossier</th>
								<th style="text-align: center;font-weight:bold;">Date de la derni&#232;re enregistrement</th>
							</tr>
							<tr>
								<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="ectd/company_id" /></span> </td>
								<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="ectd/dossier_type" /></span> </td>
								<td style="text-align: center;"> <span class="mouseHover"><xsl:value-of select="ectd/dossier_id" /></span> </td>
								<td style="text-align: center;"> <span class="mouseHover"><xsl:apply-templates select="date_saved" /></span> </td>
							</tr>
						</table>
					</div>
		<section>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Information r&#233;glementaire</h2>
				</div>
				<div class="panel-body">										
					<div class="well well-sm" >
						<div class="row">
							<div class="col-xs-12">
								<strong> Nom du produit:&#160; </strong>
								<span class="mouseHover">
									<xsl:value-of select="ectd/product_name"/>
								</span>
							</div>
						</div>
						<!--<div class="row">-->
							<!--<div class="col-xs-12">-->
								<!--<strong> La pr&#233;sentation sera-t-elle sign&#233;e ou d&#233;pos&#233;e par un tiers au nom du fabricant ou du promoteur?&#160; </strong>-->
								<!--<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="is_third_party"/></xsl:call-template>-->
								<!--</span>-->
							<!--</div>-->
							<!--<xsl:if test="is_third_party = 'Y'">-->
							<!--<div class="col-xs-11">-->
								<!--<div class="alert alert-info">-->
									<!--Une lettre d’autorisation signée par le fabricant ou le promoteur doit être fournie dans la section 1.2.1 de la transaction réglementaire.-->
								<!--</div>-->
							<!--</div>-->
							<!--</xsl:if>-->
						<!--</div>-->
						<div class="row">
							<div class="col-xs-12">
								<strong> Cette activit&#233; de r&#233;glementation a-t-elle &#233;t&#233; approuv&#233;e aux fins d’examen prioritaire?&#160; </strong>
								<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="is_priority"/></xsl:call-template>
								</span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong> Cette activité de réglementation a-t-elle été approuvée aux fins d’examen pour un AC-C?&#160; </strong>
								<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="is_noc"/></xsl:call-template>
								</span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong> S'agit-il d'une demande administrative ou d'une pr&#233;sentation?&#160; </strong>
								<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="is_admin_sub"/></xsl:call-template>
								</span>
							</div>
						</div>
						<xsl:if test="is_admin_sub = 'Y'">
						<div class="row">
							<div class="col-xs-12">
								<strong> Raison de la demande administrative ou de la pr&#233;sentation&#160; </strong>
								<span class="mouseHover"><xsl:value-of select="sub_type"/>
								</span>
							</div>
						</div>
						<div class="row">
							<!--<div class="col-xs-12">-->
								<!--<strong> Description de la présentation administrative ou de la composante administrative&#160; </strong>-->
							<!--</div>-->
								<xsl:call-template name="converter"><xsl:with-param name="value" select="sub_type/@id"/></xsl:call-template>
						</div>
						</xsl:if>
					</div>

					<div class="well well-sm" >
								<header class="panel-heading" >
									<h4 class="panel-title" >D&#233;tails de la transaction</h4>
								</header>								
							<div class="row">
								
								<div class="panel-body" >
										<xsl:for-each select="ectd/lifecycle_record">
													<fieldset>
														<legend>Enregistrement des d&#233;tails de la transaction</legend>
														<div class="row">
															<div class="form-group col-md-6">
															<strong class="padLeft3">Num&#233;ro de contrôle:&#160;</strong><span class="mouseHover"><xsl:value-of select="control_number"/></span>
															</div>
														</div>
														<div class="row">
														</div>
														<div class="row">
															<div class="col-xs-12">
															<strong class="padLeft3">Responsable de l’activit&#233; r&#233;glementaire:&#160;</strong><span class="mouseHover"><xsl:value-of select="regulatory_activity_lead"/></span>
															</div>
                                                        </div>
                                                         <div class="row">
                                                              <div class="col-md-12">
                                                                <xsl:if test="regulatory_activity_lead !=''">
                                                                  <strong class="padLeft3">Description du responsable de l'activit&#233; de r&#233;glementation :&#160;</strong>
                                                                    <div class="col-md-11">
                                                                        <xsl:if test="regulatory_activity_lead/@id = 'B14-20160301-02'"><!--Bio-->
                                                                         <span class="mouseHover">
                                                                             Biologique: Comprend toutes les activités et transactions de r&#233;glementation relevant du
                                                                             mandat de la Direction des produits biologiques et des m&#233;dicaments radiopharmaceutiques (DMBR)
                                                                             (produits biologiques / radiopharmaceutiques).
                                                                         </span>
                                                                        </xsl:if>

                                                                        <xsl:if test="regulatory_activity_lead/@id = 'B14-20160301-06'">
                                                                            <span class="mouseHover">
                                                                                Produit de sant&#233; destin&#233;s aux consommateurs: Comprend toutes les activit&#233;s et transactions r&#233;glementaires
                                                                                concernant les produits pharmaceutiques et d&#233;sinfectants sans ordonnance sous le mandat de la Direction
                                                                                des produits de sant&#233; naturels et sans ordonnance (DPSNSO).
                                                                            </span>
                                                                        </xsl:if>

                                                                        <xsl:if test="regulatory_activity_lead/@id = 'B14-20160301-09'">
                                                                            <span class="mouseHover">
                                                                                Pharmaceutique: comprend toutes les activit&#233;s et transactions r&#233;glementaires relatives aux produits
                                                                                pharmaceutiques sur ordonnance et aux produits &#233;thiques sous le mandat de la direction des m&#233;dicaments pharmaceutiques (DMP).
                                                                                Cette piste ne s'applique pas aux produits pharmaceutiques ou d&#233;sinfectants sans ordonnance ni aux
                                                                                activit&#233;s de r&#233;glementation de la vigilance post-commercialisation.
                                                                            </span>
                                                                        </xsl:if>

                                                                        <xsl:if test="regulatory_activity_lead/@id = 'B14-20160301-10'">
                                                                            <span class="mouseHover">
                                                                                Vigilance post-commercialisation: Comprend toutes les activit&#233;s et transactions r&#233;glementaires relevant
                                                                                du mandat de la Direction des produits de sant&#233; commercialis&#233;s (DPSC) (produits pharmaceutiques sur
                                                                                ordonnance et sans ordonnance à usage humain, produits biologiques, radiopharmaceutiques)
                                                                            </span>
                                                                        </xsl:if>

                                                                        <xsl:if test="regulatory_activity_lead/@id = 'B14-20160301-11'">
                                                                            <span class="mouseHover">
                                                                                V&#233;t&#233;rinaire: Comprend toutes les activit&#233;s et transactions r&#233;glementaires relatives aux produits
                                                                                pharmaceutiques sur ordonnance et en vente libre sous le mandat de la Direction des m&#233;dicaments
                                                                                v&#233;t&#233;rinaires (DMV).
                                                                            </span>
                                                                        </xsl:if>
                                                                    </div>
                                                                </xsl:if>
                                                              </div>

															<div class="col-xs-12">
															<strong class="padLeft3">Type d'activit&#233; r&#233;glementaire:&#160;</strong><span class="mouseHover"><xsl:value-of select="regulatory_activity_type"/></span>
															</div>
														</div>
														<div class="row">
															<div class="form-group col-md-12">
															<strong class="padLeft3">Description de transaction de r&#233;glementation :&#160;</strong><span class="mouseHover">
															<xsl:choose>
															<xsl:when test="sequence_description_value/@id = 'YEAR'">
																<xsl:value-of select="sequence_description_value"/>:&#160;<xsl:value-of select="transaction_description"/>
															</xsl:when>
															<xsl:when test="sequence_description_value/@id = 'YEAR_LIST_OF_CHANGE'">
																<div class="col-md-12"><xsl:value-of select="sequence_description_value"/>:</div>
																<div class="col-md-12">
																<xsl:call-template name="break"><xsl:with-param name="text" select="sequence_year"/></xsl:call-template>
																</div>

															</xsl:when>
															<xsl:otherwise>
																<xsl:value-of select="transaction_description"/>
															</xsl:otherwise>
															</xsl:choose>
															</span>
															</div>
														</div>
														<xsl:if test="requester_name != ''">
														<div class="row">
															<div class="col-md-12">
															<strong class="padLeft3">Demandeur d’information sollicit&#233;e:&#160;</strong>
															</div>

															<div class="col-md-12">
																<span class="col-xs-2">Demandeur 1:&#160;</span>
																<span class="col-xs-3 mouseHover"><xsl:value-of select="requester_name"/></span>
															</div>
															<xsl:if test="requester_name2 != ''">
															<div class="col-md-12">
																<span class="col-xs-2">Demandeur 2:&#160;</span>
																<span class="col-xs-3 mouseHover"><xsl:value-of select="requester_name2"/></span>
															</div>
															</xsl:if>
															<xsl:if test="requester_name3 != ''">
															<div class="col-md-12">
																<span class="col-xs-2">Demandeur 3:&#160;</span>
																<span class="col-xs-3 mouseHover"><xsl:value-of select="requester_name3"/></span>
															</div>
															</xsl:if>
														</div>
														</xsl:if>
													</fieldset>
										</xsl:for-each>
								</div>
							</div>
						</div>

					<!--<xsl:if test="regulatory_project_manager1 != '' or regulartory_project_manager2 != ''">-->
					<!--<h4>Responsable de projet r&#233;glementaire, si connu: &#160;</h4>-->
					<!---->
					<!--<div class="well well-sm" >-->
						<!--<div class="row">-->
							<!--<div class="col-xs-12">-->
								<!--<span class="mouseHover"> <xsl:apply-templates select="regulatory_project_manager1" /> </span>-->
							<!--</div>-->
						<!--</div>-->
						<!--<div class="row">-->
							<!--<div class="col-xs-12">-->
								<!--<span class="mouseHover"> <xsl:apply-templates select="regulatory_project_manager2" /> </span>-->
							<!--</div>-->
						<!--</div>-->
					<!--</div>-->
					<!--</xsl:if>-->
					<div class="well well-sm" >
						<div class="row">
							<div class="col-xs-12">
								<strong> Est-ce que des frais nouveaux ou r&#233;vis&#233;s sont associ&#233;s &#224; cette transaction? Veuillez identifier les frais lors de la demande de remise.&#160; </strong>
								<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="is_fees"/></xsl:call-template>
								</span>
							</div>
						</div>
					</div>

				</div>		
			</div>
			<xsl:if test="is_fees = 'Y'">
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Frais</h2>
				</div>
				<div class="panel-body">
					<div class="well well-sm" >
						<div class="row">
							<div class="col-xs-12">
								<strong> Cat&#233;gorie de la pr&#233;sentation:&#160; </strong>
								<span class="mouseHover">
									<xsl:value-of select="fee_details/submission_class"/>
								</span>
							</div>
							<div class="col-xs-12">
								<strong>Description de la pr&#233;sentation:&#160;</strong>
								<div class="col-xs-12">
								<span class="mouseHover">
								<xsl:call-template name="break"><xsl:with-param name="text" select="fee_details/submission_description"/></xsl:call-template>
								</span>
								</div>
							</div>
						</div>
					</div>
					<div class="well well-sm" >
						<div class="row">
							<div class="form-group col-xs-12 h3 text-info">Mesures d'atténuation</div>

							<xsl:if test="fee_details/mitigation/mitigation_type !=''">
							<div class="col-xs-12">
								<strong>Il est possible de se prévaloir des mesures d’atténuation suivantes (choisir un). Les promoteurs doivent certifier qu’ils satisfont aux critères établis dans le Règlement sur les aliments et drogues.</strong>
							</div>
							<div class="col-xs-12">
								<div class="col-xs-12">
									<span class="mouseHover"><xsl:value-of select="fee_details/mitigation/mitigation_type/@label_fr"/></span>
								</div>
							</div>
							</xsl:if>
							<div class="col-xs-12">
							<xsl:if test="fee_details/mitigation/mitigation_type/@id = 'SMALL_BUSINESS'">
								<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="fee_details/mitigation/certify_organization"/></xsl:call-template>
								<strong>Nous certifions que nous répondons à la définition de petites entreprises et que nous avons enregistré notre entreprise auprès de Santé Canada avant de soumettre cette soumission ou demande. Nous comprenons que le fait de ne pas s'inscrire en tant que petite entreprise avant de soumettre cette soumission ou demande entraînera l'inscription intégrale à la totalité des frais.</strong>
								
								<div class="col-xs-12">
								<strong>Nous n'avons pas encore déposé de demande d'un médicament auprès de Santé Canada. Nous sommes en train de déposer notre première demande de traitement de médicaments.</strong>
								&#160;&#160;<span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="fee_details/mitigation/small_business_fee_application"/></xsl:call-template></span>
								</div>
							</xsl:if>
							<xsl:if test="fee_details/mitigation/mitigation_type/@id = 'URGENT_HEALTH_NEED'">
								<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="fee_details/mitigation/certify_urgent_health_need"/></xsl:call-template>
								<strong>Nous certifions que le médicament faisant l’objet de la présentation ou de la demande se trouve dans la liste des médicaments utilisés pour des besoins urgents en matière de santé publique conformément au Règlement sur l’accès aux médicaments dans des circonstances exceptionnelles, et que :</strong>
								<div class="col-xs-12">
								<ol class="lst-lwr-alph">
									<li>Le médicament comporte le même ingrédient médicinal, la même concentration et la même voie d’administration, ainsi qu’une forme dosifiée comparable, qu’un médicament qui pourrait être importé en vertu du paragraphe C.10.001(2) de ce règlement;</li>
									<li>Aucun numéro d’identification de médicament n’a été attribué en vertu de l’article C.01.014.2 de ce règlement pour ce médicament ou pour un autre médicament qui comporte le même ingrédient médicinal, la même concentration et la même voie d’administration et est offert dans une forme dosifiée comparable;</li>
									<li>Aucun avis de conformité n’a été émis en vertu de l’article C.08.004 de ce règlement pour ce médicament ou pour un autre médicament qui comporte le même ingrédient médicinal, la même concentration et la même voie d’administration et est offert dans une forme dosifiée comparable;</li>
								</ol>
								</div>
							</xsl:if>
							<xsl:if test="fee_details/mitigation/mitigation_type/@id = 'FUNDED_INSTITUTION'">
								<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="fee_details/mitigation/certify_funded_health_institution"/></xsl:call-template>
								<strong>Nous certifions que notre établissement est financé par le gouvernement du Canada ou le gouvernement d’une province ou d’un territoire et que cet établissement:</strong>
								<ol class="lst-lwr-alph">
									<li>est autorisé, approuvé ou désigné par une province en conformité avec les lois de cette province pour fournir des soins ou des traitements à des personnes ou à des animaux souffrant de quelque maladie que ce soit ou</li>
									<li>est la propriété du gouvernement du Canada ou est exploité par ce dernier ou par le gouvernement d’une province et fournit des soins de santé.</li>
								</ol>
							</xsl:if>
							<xsl:if test="fee_details/mitigation/mitigation_type/@id = 'GOVERMENT_ORGANIZATION'">
								<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="fee_details/mitigation/certify_goverment_organization"/></xsl:call-template>
								<strong>Nous certifions que notre organisation est une Direction générale ou une agence du gouvernement du Canada ou d’une province ou d’un territoire.</strong>
							</xsl:if>
                            <xsl:if test="fee_details/mitigation/mitigation_type/@id = 'ISAD'">
                                <xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="fee_details/mitigation/certify_isad"/></xsl:call-template>
                                <strong>Nous certifions que nous avons déposé une demande pour un médicament COVID-19 désigné en vertu de l'ordonnance provisoire concernant l'importation, la vente et la publicité de médicaments à utiliser en relation avec le COVID-19 (ISAD), et qu'une soumission n'a pas été déposée auparavant pour approbation pour ce même médicament.</strong>
                            </xsl:if>
							</div>
						</div>
					</div>
				</div>
			</div>
			</xsl:if>
			
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Personne-ressource pour cette activit&#233; r&#233;glementaire</h2>
				</div>
				<div class="panel-body">
					<!--<h4>Personne-ressource pour cette activit&#233; r&#233;glementaire</h4>-->
					<strong>A. Information sur l'entreprise: </strong>
                    <div class="well well-sm" >
                        <div class="row">
                            <div class="col-xs-12">
                                <strong>Le contact pour cette activité de réglementation est-il un tiers correspondant au nom du fabricant / sponsor?&#160;</strong>
                                <span class="mouseHover"><xsl:call-template name="YesNoUnknow"><xsl:with-param name="value" select="is_third_party"/></xsl:call-template>
                                </span>
                            </div>
                            <xsl:if test="is_third_party = 'Y'">
                            <div class="col-xs-11 alert alert-info">
                                    <ul>
                                        <li>Si le type d'activité réglementaire est NDS, SNDS, ANDS, SANDS, SNDS-C, SANDS-C, NC, EUNDS, EUSNDS, EUANDS,
                                            EUSANDS, DINA, DINB, DIND, DINF, PDC, PDC-B , une lettre d'autorisation de tiers est requise dans le cadre de la transaction
                                            initiale de  cette activité de réglementation.
                                        </li>
                                        <li>Si le contact a changé, une nouvelle lettre d'autorisation est requise.</li>
                                        <li>Si le contact n'a pas changé, une autre lettre d'autorisation de tiers n'est pas requise sous le même numéro de contrôle.</li>
                                    </ul>
                            </div>
							<div class="col-xs-12">
								<strong>Nom de l'entreprise(nom légal complet)</strong>
							</div>
							<div class="col-xs-12">
								<span class="mouseHover"><xsl:apply-templates select="company_name" /> </span>
							</div>
                            </xsl:if>
						</div>
					</div>
                    <xsl:if test="is_third_party = 'Y'">
					<strong>B. Adresse: </strong>
					<div class="well well-sm" >
						<div class="row">
							<div class="col-xs-12">
								<span class="mouseHover"> <xsl:apply-templates select="regulatory_activity_address/street_address" /> </span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<span class="mouseHover"> <xsl:apply-templates select="regulatory_activity_address/city" /> </span>
								<strong>, &#160;&#160; </strong>
								<span class="mouseHover"> <xsl:choose><xsl:when test="(regulatory_activity_address/country/@id = 'CAN') or (regulatory_activity_address/country/@id = 'USA')"><xsl:value-of select="regulatory_activity_address/province_lov" /><strong>, &#160;&#160;</strong></xsl:when><xsl:otherwise><xsl:if test="regulatory_activity_address/province_text != ''"><xsl:value-of select="regulatory_activity_address/province_text" /><strong>, &#160;&#160;</strong></xsl:if></xsl:otherwise></xsl:choose> </span>
								<span class="mouseHover"> <xsl:value-of select="regulatory_activity_address/country"/></span>
							</div>
							<div class="col-xs-12">
								<span class="mouseHover"> <xsl:apply-templates select="regulatory_activity_address/postal_code" /> </span>
							</div>
						</div>
					</div>
                    </xsl:if>
                    <xsl:if test="is_third_party = 'N'"><h4>B. Repr&#233;sentative de l'entrepise: </h4></xsl:if>
                    <xsl:if test="is_third_party = 'Y'"><h4>C. Repr&#233;sentative de l'entrepise: </h4></xsl:if>
					<div class="well well-sm" >
						<div class="row">
							<div class="col-xs-12">
								<strong class="col-xs-3 minWidth150"> Titre&#160;&#160; 
								<span class="mouseHover normalWeight"> <xsl:apply-templates select="regulatory_activity_contact/job_title" /> </span></strong>
								<strong class="col-xs-3">&#160;</strong>
								<strong class="col-xs-4 minWidth150"> Langue de correspondance&#160;&#160; 
								<span class="mouseHover normalWeight"><xsl:value-of select="regulatory_activity_contact/language_correspondance"/></span></strong>
							</div>
							<div class="col-xs-12">
								<strong class="col-xs-3 minWidth300">Pr&#233;nom&#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/given_name" /> </span> </strong>
								<strong class="col-xs-3 minWidth300"> Initials&#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/initials" /> </span> </strong>
								<strong class="col-xs-3 minWidth300"> Nom de famille&#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/surname" /> </span> </strong>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong class="col-xs-7 minWidth300">T&#233;l&#233;phone&#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/phone_num" /> </span>&#160;&#160;
								Numéro de l'extension &#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/phone_ext" /> </span> </strong>
								<strong class="col-xs-4  minWidth300">No. de fax&#160;&#160; 
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/fax_num" /> </span></strong>
							</div>
							<div class="col-xs-12">
								<strong class="col-xs-12">Courriel&#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/email" /> </span></strong>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong class="col-xs-12">Identificateur  d'acheminement&#160;&#160;
								<span class="mouseHover normalWeight"> <xsl:value-of select="regulatory_activity_contact/RoutingID" /></span></strong>
							</div>
						</div>
					</div>
					<div class="well well-sm" >
						<div class="row">
							<div class="col-xs-12">
								<strong>
										<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="confirm_regulatory_contact"/></xsl:call-template>
								<span class="mouseHover">Je confirme que l'information de la personne-ressource de l’activité réglementaire ci-dessus est valide.</span></strong>
							</div>
						</div>
					</div>
					
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
		<xsl:when test="$value = 'Y'">
			<xsl:value-of select="'Oui'"/>
		</xsl:when>
		<xsl:when test="$value = 'N'">
			<xsl:value-of select="'Non'"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="'Non déterminé'"/>
		</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="hp-checkbox">
		<xsl:param name="value" select="/.."/>
		<span class="c-checkbox">
		<xsl:choose>
			<xsl:when test="$value = 'Y'">
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
	<xsl:template name="converter">
		<xsl:param name="value" select="/.."/>
		<xsl:choose>
			<xsl:when test=" 'en' = $value">
				<xsl:value-of select="'English'"/>
			</xsl:when>
			<xsl:when test=" 'fr' = $value">
				<xsl:value-of select="'French'"/>
			</xsl:when>
			<xsl:when test=" 'SALUT_MR' = $value">
				<xsl:value-of select="'Mr.'"/>
			</xsl:when>
			<xsl:when test=" 'SALUT_MS' = $value">
				<xsl:value-of select="'Ms.'"/>
			</xsl:when>
			<xsl:when test=" 'SALUT_DR' = $value">
				<xsl:value-of select="'Dr.'"/>
			</xsl:when>
			<xsl:when test=" 'SALUT_MRS' = $value">
				<xsl:value-of select="'Mrs.'"/>
			</xsl:when>
			<xsl:when test=" 'AB' = $value"><xsl:value-of select="'Alberta'"/></xsl:when>
			<xsl:when test=" 'BC' = $value"><xsl:value-of select="'Columbie Britannique'"/></xsl:when>
			<xsl:when test=" 'MB' = $value"><xsl:value-of select="'Manitoba'"/></xsl:when>
			<xsl:when test=" 'NB' = $value"><xsl:value-of select="'Nouveau Brunswick'"/></xsl:when>
			<xsl:when test=" 'NL' = $value"><xsl:value-of select="'Terre Neuve et Labrador'"/></xsl:when>
			<xsl:when test=" 'NT' = $value"><xsl:value-of select="'Territoires du Nord-Ouest'"/></xsl:when>
			<xsl:when test=" 'NS' = $value"><xsl:value-of select="'Nouvelle &#201;cosse'"/></xsl:when>
			<xsl:when test=" 'NU' = $value"><xsl:value-of select="'Nunavut'"/></xsl:when>
			<xsl:when test=" 'ON' = $value"><xsl:value-of select="'Ontario'"/></xsl:when>
			<xsl:when test=" 'PE' = $value"><xsl:value-of select="'Isle du Prince &#201;douard'"/></xsl:when>
			<xsl:when test=" 'QC' = $value"><xsl:value-of select="'Qu&#233;bec'"/></xsl:when>
			<xsl:when test=" 'SK' = $value"><xsl:value-of select="'Saskatchewan'"/></xsl:when>
			<xsl:when test=" 'YT' = $value"><xsl:value-of select="'Yukon'"/></xsl:when>
			<xsl:when test=" 'AL' = $value"><xsl:value-of select="'Alabama'"/></xsl:when>
			<xsl:when test=" 'AK' = $value"><xsl:value-of select="'Alaska'"/></xsl:when>
			<xsl:when test=" 'AZ' = $value"><xsl:value-of select="'Arizona'"/></xsl:when>
			<xsl:when test=" 'AR' = $value"><xsl:value-of select="'Arkansas'"/></xsl:when>
			<xsl:when test=" 'CA' = $value"><xsl:value-of select="'California'"/></xsl:when>
			<xsl:when test=" 'CO' = $value"><xsl:value-of select="'Colorado'"/></xsl:when>
			<xsl:when test=" 'CT' = $value"><xsl:value-of select="'Connecticut'"/></xsl:when>
			<xsl:when test=" 'DE' = $value"><xsl:value-of select="'Delaware'"/></xsl:when>
			<xsl:when test=" 'FL' = $value"><xsl:value-of select="'Florida'"/></xsl:when>
			<xsl:when test=" 'GA' = $value"><xsl:value-of select="'Georgia'"/></xsl:when>
			<xsl:when test=" 'HI' = $value"><xsl:value-of select="'Hawaii'"/></xsl:when>
			<xsl:when test=" 'ID' = $value"><xsl:value-of select="'Idaho'"/></xsl:when>
			<xsl:when test=" 'IL' = $value"><xsl:value-of select="'Illinois'"/></xsl:when>
			<xsl:when test=" 'IN' = $value"><xsl:value-of select="'Indiana'"/></xsl:when>
			<xsl:when test=" 'IA' = $value"><xsl:value-of select="'Iowa'"/></xsl:when>
			<xsl:when test=" 'KS' = $value"><xsl:value-of select="'Kansas'"/></xsl:when>
			<xsl:when test=" 'KY' = $value"><xsl:value-of select="'Kentucky'"/></xsl:when>
			<xsl:when test=" 'LA' = $value"><xsl:value-of select="'Louisiana'"/></xsl:when>
			<xsl:when test=" 'ME' = $value"><xsl:value-of select="'Maine'"/></xsl:when>
			<xsl:when test=" 'MD' = $value"><xsl:value-of select="'Maryland'"/></xsl:when>
			<xsl:when test=" 'MA' = $value"><xsl:value-of select="'Massachusetts'"/></xsl:when>
			<xsl:when test=" 'MI' = $value"><xsl:value-of select="'Michigan'"/></xsl:when>
			<xsl:when test=" 'MN' = $value"><xsl:value-of select="'Minnesota'"/></xsl:when>
			<xsl:when test=" 'MS' = $value"><xsl:value-of select="'Mississippi'"/></xsl:when>
			<xsl:when test=" 'MO' = $value"><xsl:value-of select="'Missouri'"/></xsl:when>
			<xsl:when test=" 'MT' = $value"><xsl:value-of select="'Montana'"/></xsl:when>
			<xsl:when test=" 'NE' = $value"><xsl:value-of select="'Nebraska'"/></xsl:when>
			<xsl:when test=" 'NV' = $value"><xsl:value-of select="'Nevada'"/></xsl:when>
			<xsl:when test=" 'NH' = $value"><xsl:value-of select="'New Hampshire'"/></xsl:when>
			<xsl:when test=" 'NJ' = $value"><xsl:value-of select="'New Jersey'"/></xsl:when>
			<xsl:when test=" 'NM' = $value"><xsl:value-of select="'New Mexico'"/></xsl:when>
			<xsl:when test=" 'NY' = $value"><xsl:value-of select="'New York'"/></xsl:when>
			<xsl:when test=" 'NC' = $value"><xsl:value-of select="'North Carolina'"/></xsl:when>
			<xsl:when test=" 'ND' = $value"><xsl:value-of select="'North Dakota'"/></xsl:when>
			<xsl:when test=" 'OH' = $value"><xsl:value-of select="'Ohio'"/></xsl:when>
			<xsl:when test=" 'OK' = $value"><xsl:value-of select="'Oklahoma'"/></xsl:when>
			<xsl:when test=" 'OR' = $value"><xsl:value-of select="'Oregon'"/></xsl:when>
			<xsl:when test=" 'PA' = $value"><xsl:value-of select="'Pennsylvania'"/></xsl:when>
			<xsl:when test=" 'RI' = $value"><xsl:value-of select="'Rhode Island'"/></xsl:when>
			<xsl:when test=" 'SC' = $value"><xsl:value-of select="'South Carolina'"/></xsl:when>
			<xsl:when test=" 'SD' = $value"><xsl:value-of select="'South Dakota'"/></xsl:when>
			<xsl:when test=" 'TN' = $value"><xsl:value-of select="'Tennessee'"/></xsl:when>
			<xsl:when test=" 'TX' = $value"><xsl:value-of select="'Texas'"/></xsl:when>
			<xsl:when test=" 'UT' = $value"><xsl:value-of select="'Utah'"/></xsl:when>
			<xsl:when test=" 'VT' = $value"><xsl:value-of select="'Vermont'"/></xsl:when>
			<xsl:when test=" 'VA' = $value"><xsl:value-of select="'Virginia'"/></xsl:when>
			<xsl:when test=" 'WA' = $value"><xsl:value-of select="'Washington'"/></xsl:when>
			<xsl:when test=" 'WV' = $value"><xsl:value-of select="'West Virginia'"/></xsl:when>
			<xsl:when test=" 'WI' = $value"><xsl:value-of select="'Wisconsin'"/></xsl:when>
			<xsl:when test=" 'WY' = $value"><xsl:value-of select="'Wyoming'"/></xsl:when>
			<xsl:when test="'ADDITIONAL_PRODUCT_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Les demandes concernant l’ajout d’un nom de produit, pour un produit pr&#233;c&#233;demment approuv&#233;, n’exigent pas une marque de commerce ou une &#233;valuation &#224; pr&#233;sentation et &#224; consonance semblables.  (Un nouveau DIN est d&#233;livr&#233;).</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
                        Remarque : Un nouveau numéro de dossier peut être exigé. Communiquez avec Santé Canada pour obtenir de plus amples renseignements (hc.eReview.sc@canada.ca).
						<p>Sur le présent formulaire : Utilisez le numéro de la compagnie et le numéro de dossier existants, à moins qu’un nouveau numéro de dossier ait été attribué par Santé Canada.</p>
					</div></div>
			</xsl:when>
			<xsl:when test="'PRODUCT_NAME_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Modification du nom d’un produit existant, pour un produit pr&#233;c&#233;demment approuv&#233;, qui n’exige pas une marque de commerce ou une &#233;valuation &#224; pr&#233;sentation et &#224; consonance semblables.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Sur le présent formulaire : Utilisez le numéro de la compagnie et le numéro de dossier existants.
					</div></div>
			</xsl:when>
			<xsl:when test="'OWNERSHIP_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Transfert du titre de propri&#233;t&#233; et de la responsabilit&#233; du produit d'un fabricant &#224; un autre (DIN ne change pas).</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
                        Remarque : Le numéro de dossier sera transféré à partir du propriétaire précédent si tous les DIN du dossier sont transférés. Vous pouvez également communiquer avec Santé Canada pour obtenir de plus amples renseignements: eReview@hc-sc.gc.ca pour les médicaments à usage humain et vdd.skmd.so-dgps.dmv.cp.sc@hc-sc.gc.ca pour les médicaments à usage vétérinaire.
						<p>Sur le présent formulaire : Utilisez le numéro de la compagnie pour le nouveau propriétaire et le numéro de dossier existant, à moins qu’un nouveau numéro de dossier ait été attribué par Santé Canada.</p>
					</div></div>
			</xsl:when>
			<xsl:when test="'LICENGSING' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Contrat en vertu duquel un fabricant (le conc&#233;dant de licence) fournit un produit pharmaceutique &#224; un autre fabricant (le titulaire de licence) afin qu'il soit vendu sous le nom du second fabricant.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Remarque : Un nouveau numéro de dossier est exigé si les produits proposés n’ont pas été préalablement approuvés (c.-à-d., ils n’ont pas de numéro de dossier), sauf dans le cas d’un remplacement du contrat de licence initial. Communiquez avec Santé Canada pour obtenir de plus amples renseignements (hc.eReview.sc@canada.ca).
						<p>Sur le présent formulaire : Utilisez le numéro de la compagnie pour le nouveau propriétaire (titulaire de licence) et le numéro de dossier existant, à moins qu’un nouveau numéro de dossier ait été attribué par Santé Canada.</p>
					</div></div>
			</xsl:when>
			<xsl:when test="'PRODUCT_MANUFACT_NAME_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Modification du nom du fabricant et du nom du produit.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Remarque : L’inscription de l’entreprise doit être modifiée. Un nouveau numéro de la compagnie sera émis pour tout changement important de nom.
						<p>Sur le présent formulaire : Utilisez le nouveau numéro de la compagnie  (associé au nom du nouveau fabricant) et le numéro de dossier existant.</p>
					</div></div>
			</xsl:when>
			<xsl:when test="'MANUFACT_NAME_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Modification du nom du fabricant.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Remarque : L’inscription de l’entreprise doit être modifiée. Un nouveau numéro de la compagnie sera émis pour tout changement important de nom.
						<p>Sur le présent formulaire : Utilisez le nouveau numéro de la compagnie  (associé au nom du nouveau fabricant) et le numéro de dossier existant.</p>
					</div></div>
			</xsl:when>
			<xsl:when test="'MERGER' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">La combinaison de deux ou plusieurs entit&#233;s pour en constituer une seule par un achat, une acquisition, une mise en commun d'int&#233;rêts ou l'achat de la participation conf&#233;rant le contrôle d'un fabricant par un autre en vue d'une reprise de biens ou d'activit&#233;s.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Remarque : Si la fusion ou le rachat a entraîné un changement de nom d’entreprise, l’inscription de l’entreprise doit être modifiée. Un nouveau numéro de la compagnie sera émis. Le numéro de dossier demeurera le même, car le dossier du propriétaire antérieur sera transféré au nouveau propriétaire.
						<p>Sur le présent formulaire : Utilisez le numéro de la compagnie pour le nouveau propriétaire et le numéro de dossier existant.</p>
					</div></div>
			</xsl:when>
			<xsl:when test="'POSTAUTH_CHEMISTRY_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Pour les produits vis&#233;s par les annexes C et D : Mises &#224; jour des renseignements sur la composition chimique et la fabrication pour correspondre aux mises &#224; jour de la composition chimique du conc&#233;dant.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Sur le présent formulaire : Utilisez le numéro de la compagnie et le numéro de dossier existants.
					</div></div>
			</xsl:when>
			<xsl:when test="'POSTAUTH_LABEL_CHGE' = $value">
					<div class="col-xs-12">
					<ul><li><span class="mouseHover">Mise &#224; jour des &#233;tiquettes (y compris, sans toutefois s’y limiter, la mise &#224; jour de la monographie du produit et l’&#233;tiquette int&#233;rieure et ext&#233;rieure) pour correspondre aux mises &#224; jour de l’&#233;tiquette du conc&#233;dant.</span></li></ul>
					</div>
					<div class="col-xs-12">
					<div class="alert alert-info">
						Sur le présent formulaire : Utilisez le numéro de la compagnie et le numéro de dossier existants.
					</div></div>
			</xsl:when>
		</xsl:choose>		
	</xsl:template>
</xsl:transform><!-- Stylus Studio meta-information - (c) 2004-2009. Progress Software Corporation. All rights reserved.

<metaInformation>
	<scenarios>
		<scenario default="yes" name="Scenario1" userelativepaths="no" externalpreview="yes" url="file:///c:/Users/hcuser/Downloads/hcreprt-2020-05-13-1127.xml" htmlbaseurl="" outputurl="file:///c:/Users/SPM/test/TRANSACTION.html" processortype="saxon8"
		          useresolver="yes" profilemode="0" profiledepth="" profilelength="" urlprofilexml="" commandline="" additionalpath="" additionalclasspath="" postprocessortype="none" postprocesscommandline="" postprocessadditionalpath=""
		          postprocessgeneratedext="" validateoutput="no" validator="internal" customvalidator="">
			<parameterValue name="cssFile" value="'file:///C:/Users/hcuser/git/XSLT/Pharma-Bio-REP/v_3_0/Style-Sheets/ip400-1.css'"/>
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
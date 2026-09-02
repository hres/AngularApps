<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
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
    background-color: transparent
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
td, th {
    padding: 0
}
.row {
    margin-left: -15px;
    margin-right: -15px;
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
span.mouseHover:hover {
	border: none;
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
.mgtTop2 {
	margin-top: 2px;
}
</xsl:text>
				</style>
			</head>
            <body>
				<xsl:if test="count(COMPANY_ENROL) &gt; 0"> <xsl:apply-templates select="COMPANY_ENROL"></xsl:apply-templates> </xsl:if>
			</body>
		</html>
	</xsl:template>
	
	<!-- Company Enrolment -->
	<xsl:template match="COMPANY_ENROL">
		<h1>Modéle de compagnie : Processus d'inscription réglementaire (PIR) pour les produits pharmaceutiques humain et vétérinaire et biocides <xsl:if test="software_version != ''">(version <xsl:value-of select="software_version"/>)</xsl:if></h1>
        <section>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Inscription d'une compagnie réglementaire</h2>
				</div>
								<div class="panel-body">
                    <div class="well well-sm" >
			            <table border="1" cellspacing="2" cellpadding="2" style="table-layout: fixed; width: 100%;word-wrap: break-word;">
                            <tr>
                                <th style="text-align: center;font-weight:bold;">Statut de l'inscription</th>
                                <th style="text-align: center;font-weight:bold;">Version de l'inscription</th>
                                <th style="text-align: center;font-weight:bold;">Date du dernier enregistrement</th>
                                <th style="text-align: center;font-weight:bold;">Identifiant de la compagnie</th>
                            </tr>
                            <tr>
                                <td style="text-align: center;"><span class="mouseHover"><xsl:value-of select="application_type/@label_fr"/></span> </td>
                                <td style="text-align: center;"><span class="mouseHover"><xsl:value-of select="enrolment_version" /></span> </td>
                                <td style="text-align: center;"><span class="mouseHover"><xsl:value-of select="substring(date_saved,0,11)" /></span> </td>
                                <td style="text-align: center;"><span class="mouseHover"><xsl:value-of select="company_id" /></span> </td>
                            </tr>
                        </table>
                    </div>
                    <div class="row">
                        <div class="panel-body">
                            <strong>Motif du dépôt : </strong>
                            <span class="mouseHover">
                                <xsl:value-of select="reason_amend" />
                            </span>
                        </div>
                    </div>
					<section class="panel panel-default" >
						<div class="panel-heading">
							<h2 class="panel-title">Information d'adresse</h2>
						</div>
						<div class="panel-body">
                            <xsl:for-each select="address_record">
                                <section class="panel panel-default" >
                                    <div class="panel-heading">
                                        <h2 class="panel-title">Détails d'adresse <xsl:value-of select="id" /></h2>
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Nom de la compagnie : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_name" />
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Numéro d’entreprise de l'Agence du revenu du Canada : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="business_number" />
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Rue : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_address_details/street_address" />
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Ville : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_address_details/city" />
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Pays : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_address_details/country/@label_fr" />
                                                </span>
                                            </div>
                                        </div>
                                        <xsl:choose>
                                            <xsl:when test="company_address_details/country/@id = 'CA'">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <strong>Province : </strong>
                                                        <span class="mouseHover">
                                                            <xsl:value-of select="company_address_details/province_lov/@label_fr" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <strong>Code postal : </strong>
                                                        <span class="mouseHover">
                                                            <xsl:value-of select="company_address_details/postal_code" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </xsl:when>
                                            <xsl:when test="company_address_details/country/@id = 'US'">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <strong>État : </strong>
                                                        <span class="mouseHover">
                                                            <xsl:value-of select="company_address_details/province_lov/@label_fr" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <strong>Code ZIP : </strong>
                                                        <span class="mouseHover">
                                                            <xsl:value-of select="company_address_details/postal_code" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <strong>Province ou état : </strong>
                                                        <span class="mouseHover">
                                                            <xsl:value-of select="company_address_details/province_text" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <strong>Code postal / ZIP : </strong>
                                                        <span class="mouseHover">
                                                            <xsl:value-of select="company_address_details/postal_code" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Sélectionner un ou plusieurs rôles pour cette compagnie : </strong>
                                                <span class="mouseHover">
                                                    <xsl:call-template name="addressRoles"/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>    
                                </section>    
                            </xsl:for-each> 
					    </div>
				    </section>
					<section class="panel panel-default" >
						<div class="panel-heading">
							<h2 class="panel-title">Information sur les représentants de la compagnie</h2>
						</div>
						<div class="panel-body">
                            <xsl:for-each select="contact_record">
                               <section class="panel panel-default" >
                                    <div class="panel-heading">
                                        <h2 class="panel-title">Détails du représentant de la compagnie <xsl:value-of select="id" /></h2>
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Prénom : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/given_name" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Initiales : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/initials" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Nom de famille : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/surname" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Langue de correspondance : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/language_correspondance/@label_fr" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Titre de poste : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/job_title" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Numéro de téléphone : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/phone_num" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Extension de téléphone : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/phone_ext" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Numéro de télécopieur : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/fax_num" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Adresse de courriel : </strong>
                                                <span class="mouseHover">
                                                    <xsl:value-of select="company_contact_details/email" />
                                                </span>
                                            </div>
						                </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <strong>Sélectionner un ou plusieurs rôles pour ce représentant de la compagnie : </strong>
                                                <span class="mouseHover">
                                                    <xsl:call-template name="contactRoles"/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section> 
                            </xsl:for-each> 
						</div>
					</section>
                    <section class="panel panel-default" >
                        <div class="panel-heading">
							<h2 class="panel-title">Cadres réglementaires</h2>
						</div>
						<div class="panel-body">
                            <strong>Sélectionnez un ou plusieurs des cadres réglementaires suivants en vertu duquel / desquels le fabricant / promoteur pourrait déposer une présentation / demande :</strong>
                            <xsl:for-each select="product_line_checkbox/product_line">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <span class="mouseHover">
                                            <span class="c-checkbox">X </span>
                                            <xsl:value-of select="@label_fr" />
                                        </span>
                                    </div>
						        </div>
                            </xsl:for-each>
                        </div>
                    </section>
				</div>		
			</div>
		</section>
	</xsl:template>

	<xsl:template name="hp-checkbox">
		<xsl:param name="value" select="/.."/>
		<span class="c-checkbox">
		<xsl:choose>
			<xsl:when  test="$value = 'Y' or $value = 'true'">
				X
			</xsl:when>
			<xsl:otherwise>
				&#160;&#160;
			</xsl:otherwise>
		</xsl:choose>
		</span>
	</xsl:template>

    <xsl:template name="addressRoles">
		<dl>
		<xsl:if test="manufacturer = 'Y'">
		<dt class="mgtTop2">
			<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="manufacturer"/></xsl:call-template>
			<span class="normalWeight mouseHover" style="font-weight:100;">Adresse postale du fabricant / promoteur</span>
		</dt>
		</xsl:if>
		<xsl:if test="mailing = 'Y'">
		<dt class="mgtTop2">
			<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="mailing"/></xsl:call-template>
			<span class="normalWeight mouseHover" style="font-weight:100;">Contact pour l'adresse courrier réglementaire / adresse pour l'annuelle</span>
		</dt>
		</xsl:if>
		<xsl:if test="billing = 'Y'">
		<dt class="mgtTop2">
			<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="billing"/></xsl:call-template>
			<span class="normalWeight mouseHover" style="font-weight:100;">Adresse de facturation</span>
		</dt>
		</xsl:if>
		</dl>
	</xsl:template>

    <xsl:template name="contactRoles">
		<dl>
		<xsl:if test="manufacturer = 'Y'">
		<dt class="mgtTop2">
			<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="manufacturer"/></xsl:call-template>
			<span class="normalWeight mouseHover" style="font-weight:100;">Personne-ressource du fabricant / promoteur</span>
		</dt>
		</xsl:if>
		<xsl:if test="mailing = 'Y'">
		<dt class="mgtTop2">
			<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="mailing"/></xsl:call-template>
			<span class="normalWeight mouseHover" style="font-weight:100;">Courrier réglementaire / adresse de personne-ressource pour l'annuelle</span>
		</dt>
		</xsl:if>
		<xsl:if test="billing = 'Y'">
		<dt class="mgtTop2">
			<xsl:call-template name="hp-checkbox"><xsl:with-param name="value" select="billing"/></xsl:call-template>
			<span class="normalWeight mouseHover" style="font-weight:100;">Personne-ressource de facturation</span>
		</dt>
		</xsl:if>
		</dl>
	</xsl:template>
</xsl:transform>

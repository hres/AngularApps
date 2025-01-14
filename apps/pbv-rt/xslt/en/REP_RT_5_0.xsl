<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" version="1.0">
	<xsl:template match="/">
		<html>
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=9" />
				<style type="text/css">
					<xsl:text disable-output-escaping="yes"> html { font-family: sans-serif; font-size: 10px; -webkit-tap-highlight-color: transparent display: block; color: -internal-root-color; } body { background: #f9f9f9; line-height: 1.4375; color: #333; font-family: Helvetica, Arial, sans-serif; font-size: 16px; margin: 0; } , :after, :before { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } .well { min-height: 20px; padding: 19px; margin-bottom: 20px; background-color: #f5f5f5; border: 1px solid #e3e3e3; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05); box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05) } .well blockquote { border-color: #ddd; border-color: rgba(0, 0, 0, .15) } .well-lg { padding: 24px; border-radius: 6px } .well-sm { padding: 9px; border-radius: 3px } article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary { display: block } .panel { margin-bottom: 23px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); box-shadow: 0 1px 1px rgba(0, 0, 0, .05) } .panel-body { padding: 15px } .panel-body:after, .panel-body:before { content: " "; display: table } .panel-body:after { clear: both } .panel-heading { padding: 10px 15px; border-bottom: 1px solid transparent; border-top-right-radius: 3px; border-top-left-radius: 3px } .panel-heading .dropdown .dropdown-toggle { color: inherit } .panel-title { margin-top: 0; margin-bottom: 0; font-size: 18px; color: inherit } .panel-title a { color: inherit } .panel-footer { padding: 10px 15px; background-color: #f5f5f5; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px } .panel .list-group, .panel .panel-collapse .list-group { margin-bottom: 0 } .panel .list-group .list-group-item, .panel .panel-collapse .list-group .list-group-item { border-width: 1px 0; border-radius: 0 } .panel .list-group:first-child .list-group-item:first-child, .panel .panel-collapse .list-group:first-child .list-group-item:first-child { border-top: 0; border-top-right-radius: 3px; border-top-left-radius: 3px } .panel .list-group:last-child .list-group-item:last-child, .panel .panel-collapse .list-group:last-child .list-group-item:last-child { border-bottom: 0; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px } .panel-default { border-color: #ddd } .panel-default .panel-heading { color: #333; background-color: #f5f5f5; border-color: #ddd } .panel-default .panel-heading + .panel-collapse .panel-body { border-top-color: #ddd } .panel-default .panel-heading .badge { color: #f5f5f5; background-color: #333 } .panel-default .panel-footer + .panel-collapse .panel-body { border-bottom-color: #ddd } .panel-primary { border-color: #2572b4 } .panel-primary .panel-heading { color: #fff; background-color: #2572b4; border-color: #2572b4 } .panel-primary .panel-heading + .panel-collapse .panel-body { border-top-color: #2572b4 } .panel-primary .panel-heading .badge { color: #2572b4; background-color: #fff } .panel-primary .panel-footer + .panel-collapse .panel-body { border-bottom-color: #2572b4 } .panel-title { margin-top: 0; margin-bottom: 0; font-size: 18px; color: inherit } .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 { font-family: Helvetica, Arial, sans-serif } .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 { font-weight: 700; } .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 { line-height: 1.1; color: inherit; } h1 { margin: .67em 0; } h1 { border-bottom: 1px solid #af3c43; font-size: 34px; margin-bottom: .2em; margin-top: 1.25em; padding-bottom: .2em } table { background-color: transparent; display: table; } table { border-collapse: collapse; border-spacing: 0; } .table tbody tr td, .table tbody tr th, .table tfoot tr td, .table tfoot tr th, .table thead tr td, .table thead tr th { padding: 8px; line-height: 1.4375; vertical-align: top; border-top: 1px solid #ddd; } thead { display: table-header-group; vertical-align: middle; border-color: inherit; } table.dataTable, table.dataTable td, table.dataTable th { -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; } td, th { padding: 0 } table.dataTable { border-collapse: separate; border-spacing: 0; margin: 0 auto; width: 100% !important; } table.dataTable, table.dataTable td, table.dataTable th { -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; } .panel .table-responsive:last-child .table:last-child, .panel .table:last-child { border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; } .dataTables_wrapper .dataTables_scroll, table.dataTable { clear: both; } tbody { display: table-row-group; vertical-align: middle; border-color: inherit; } .table-striped tbody tr:nth-child(odd) { background-color: #f5f5f5; } table.dataTable tbody tr { background-color: #fff; } .row { margin-left: -15px; margin-right: 15px; } .row:after, .row:before { content: " "; display: table } .row:after { clear: both } .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 { position: relative; min-height: 1px; padding-left: 15px; padding-right: 15px; } .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 { float: left; } .col-xs-12 { width: 100%; } .col-md-12 { width: 100%; } .col-xs-6 { width: 48%; } .col-md-5 { width: 40%; } .col-xs-2 { width: 16.6666666667%; } .col-xs-1 { width: 8.3333333333% } .col-xs-11 { width: 91.6666666667% } .col-xs-7 { width: 52%; } legend { padding-inline-start: 2px; padding-inline-end: 2px; display: block; width: 100%; padding: 0; margin-bottom: 23px; font-size: 24px; line-height: inherit; color: #333; border: 0; border-bottom: 0; float: left; } .form-group { margin-bottom: 15px; } .col-md-6 { width: 48%; } .col-xs-3 { width: 25%; } .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9 { float: left; } .alert-info, .label-info, .label-info[href]:active, .label-info[href]:focus, .label-info[href]:hover, details.alert.alert-info, details.alert[open].alert-info { background: #d7faff; border-color: #269abc; } .alert-danger, .alert-info, .alert-success, .alert-warning, .label-danger, .label-danger[href]:active, .label-danger[href]:focus, .label-danger[href]:hover, .label-default, .label-default[href]:active, .label-default[href]:focus, .label-default[href]:hover, .label-info, .label-info[href]:active, .label-info[href]:focus, .label-info[href]:hover, .label-primary, .label-primary[href]:active, .label-primary[href]:focus, .label-primary[href]:hover, .label-success, .label-success[href]:active, .label-success[href]:focus, .label-success[href]:hover, .label-warning, .label-warning[href]:active, .label-warning[href]:focus, .label-warning[href]:hover { color: #000; } .alert-warning, .label-warning, .label-warning[href]:active, .label-warning[href]:focus, .label-warning[href]:hover, details.alert.alert-warning, details.alert[open].alert-warning { background: #f9f4d4; border-color: #f90; } .alert-success, .label-success, .label-success[href]:active, .label-success[href]:focus, .label-success[href]:hover, details.alert.alert-success, details.alert[open].alert-success { background: #d8eeca; border-color: #278400; } .alert, .label { border-radius: 0; border-style: solid; border-width: 0 0 0 4px; } .alert { padding: 15px; margin-bottom: 23px; border: 1px solid transparent; } ul { display: block; list-style-type: disc; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; padding-inline-start: 40px; } ol, ul { margin-top: 0; margin-bottom: 11.5px; } span.mouseHover:hover { border: 1px solid black; } .c-checkbox { border-style: solid; border-width: thin; font-size: xx-small; font-weight: 900; margin-left: 15px; margin-right: 15px; padding-left: 2px; vertical-align: 2px; } span.normalWeight { font-weight: 100; } .padLeft3 { padding-left: 3px; } .nowrap { white-space: nowrap; } .lst-lwr-alph { list-style-type: lower-alpha; } .minWidth150 { min-width: 150px; } .minWidth300 { min-width: 300px; } </xsl:text>
				</style>
			</head>
			<body>
				<xsl:if test="count(TRANSACTION_ENROL) > 0">
					<xsl:apply-templates select="TRANSACTION_ENROL" />
				</xsl:if>
			</body>
		</html>
	</xsl:template>
	<!--  Transaction Enrolment  -->
	<xsl:template match="TRANSACTION_ENROL">
		<h1> Regulatory Transaction Template: Regulatory Enrolment Process (REP) <xsl:if
				test="software_version != ''"> (Version: <xsl:value-of select="software_version" />
		) </xsl:if>
		</h1>
<div class="well well-sm">
			<table border="1" cellspacing="2" cellpadding="2"
				style="table-layout: fixed; width: 100%;word-wrap: break-word;">
				<tr>
					<th style="text-align: center;font-weight:bold;">Company Identifier </th>
					<th style="text-align: center;font-weight:bold;">Dossier type</th>
					<th style="text-align: center;font-weight:bold;">Dossier Identifier </th>
					<th style="text-align: center;font-weight:bold;">Date Last Saved</th>
				</tr>
				<tr>
					<td style="text-align: center;">
						<span class="mouseHover">
							<xsl:value-of select="ectd/company_id" />
						</span>
					</td>
					<td style="text-align: center;">
						<span class="mouseHover">
							<xsl:value-of select="ectd/dossier_type/@label_en" />
						</span>
					</td>
					<td style="text-align: center;">
						<span class="mouseHover">
							<xsl:value-of select="ectd/dossier_id" />
						</span>
					</td>
					<td style="text-align: center;">
						<span class="mouseHover">
							<xsl:value-of select="substring(date_saved,1,10)" />
						</span>
					</td>
				</tr>
			</table>
		</div>
<section>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Regulatory information</h2>
				</div>
				<div class="panel-body">
					<div class="well well-sm">
						<div class="row">
							<div class="col-xs-12">
								<strong> Dossier type: </strong>
								<span class="mouseHover">
									<xsl:value-of select="ectd/dossier_type/@label_en" />
								</span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong> Company Identifier: </strong>
								<span class="mouseHover">
									<xsl:value-of select="ectd/company_id" />
								</span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong> Dossier Identifier: </strong>
								<span class="mouseHover">
									<xsl:value-of select="ectd/dossier_id" />
								</span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<strong> Product name: </strong>
								<span class="mouseHover">
									<xsl:value-of select="ectd/product_name" />
								</span>
							</div>
						</div>
						
						<xsl:if test="ectd/dossier_type/@id = 'D21' or ectd/dossier_type/@id = 'D22'">
							<div class="row">
								<div class="col-xs-12">
									<strong> Was this regulatory activity approved for priority	review? </strong>
									<span class="mouseHover">
										<xsl:call-template name="YesNoUnknow">
											<xsl:with-param name="value" select="is_priority" />
										</xsl:call-template>
									</span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-12">
									<strong> Was this regulatory activity approved for NOC/C review? </strong>
									<span class="mouseHover">
										<xsl:call-template name="YesNoUnknow">
											<xsl:with-param name="value" select="is_noc" />
										</xsl:call-template>
									</span>
								</div>
							</div>
						</xsl:if>
						<div class="row">
							<div class="col-xs-12">
								<strong> Is this an administrative submission or Application? </strong>
								<span class="mouseHover">
									<xsl:call-template name="YesNoUnknow">
										<xsl:with-param name="value" select="is_admin_sub" />
									</xsl:call-template>
								</span>
							</div>
						</div>
						<xsl:if test="is_admin_sub = 'Y'">
							<div class="row">
								<div class="col-xs-12">
									<strong> Reason for administrative submission or application: </strong>
									<span class="mouseHover">
										<xsl:value-of select="sub_type/@label_en" />
									</span>
								</div>
							</div>
						</xsl:if>
					</div>
					<div class="well well-sm">
						<header class="panel-heading">
							<h4 class="panel-title">Transaction Details</h4>
						</header>
						<div class="row">
							<div class="panel-body">
								<xsl:for-each select="ectd/lifecycle_record">
									<div class="row">
										<div class="col-md-12">
											<strong class="padLeft3">Regulatory Activity Lead: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_lead/@label_en" />
											</span>
										</div>
									</div>
									<div class="row">
										<div class="col-md-12">
											<strong class="padLeft3">Regulatory Activity Type: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_type/@label_en" />
											</span>
										</div>
									</div>
									<div class="row">
										<div class="col-md-12">
											<strong class="padLeft3">Regulatory Transaction	Description: </strong>
											<span class="mouseHover">
												<xsl:value-of select="sequence_description_value/@label_en" />
											</span>
										</div>
									</div>
									<xsl:if test="sequence_from_date !='' and sequence_to_date ='' and sequence_version=''">
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3">Date of Request: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_from_date" />
												</span>
											</div>
										</div>
									</xsl:if>
									<xsl:if test="sequence_from_date !='' and sequence_to_date !=''">
										<div class="row">
											<div class="col-md-4">
												<strong class="padLeft3">Start Date: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_from_date" />
												</span>
											</div>
											<div class="col-md-4">
												<strong class="padLeft3">End Date: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_to_date" />
												</span>
											</div>
										</div>
									</xsl:if>
									<xsl:if test="sequence_description_value/@id = 'YEAR_LIST_OF_CHANGE' or sequence_description_value/@id = 'YEAR'">
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3"><xsl:value-of select="sequence_description_value/@label_en" />: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_year" />
												</span>
											</div>
										</div>
									</xsl:if>
									<xsl:if test="sequence_description_value/@id = 'CSO_RMP'">
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3">Date of Request: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_from_date" />
												</span>
											</div>
										</div>
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3">Version number: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_version" />
												</span>
											</div>
										</div>
									</xsl:if>
									<xsl:if test="requester_name != ''">
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3">Requester of solicited	information: </strong>
											</div>
										</div>
										<div class="row">
											<div class="col-md-4">
												<strong class="padLeft3">Name of requester 1: </strong>
												<span class="mouseHover">
													<xsl:value-of select="requester_name" />
												</span>
											</div>
											<xsl:if test="requester_name2 != ''">
												<div class="col-md-4">
													<strong>Name of requester 2: </strong>
													<span class="mouseHover">
														<xsl:value-of select="requester_name2" />
													</span>
												</div>
											</xsl:if>
											<xsl:if test="requester_name3 != ''">
												<div class="col-md-4">
													<strong>Name of requester 3: </strong>
													<span class="mouseHover">
														<xsl:value-of select="requester_name3" />
													</span>
												</div>
											</xsl:if>
										</div>
									</xsl:if>
									<xsl:if test="sequence_details != ''">
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3">Brief description: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_details" />
												</span>
											</div>
										</div>
									</xsl:if>
									<xsl:if test="sequence_details_change != ''">
										<div class="row">
											<div class="col-md-12">
												<strong class="padLeft3">Brief description of change: </strong>
												<span class="mouseHover">
													<xsl:value-of select="sequence_details_change" />
												</span>
											</div>
										</div>
									</xsl:if>
									<div class="row">
										<div class="col-md-12">
											<strong class="padLeft3">Control Number: </strong>
											<span class="mouseHover">
												<xsl:value-of select="control_number" />
											</span>
										</div>
									</div>
								</xsl:for-each>
							</div>
						</div>
					</div>
					<xsl:if
						test="regulatory_project_manager1 != '' or regulartory_project_manager2 != ''">
						<h4>Name of Regulatory Project Manager, if known: </h4>
<div
							class="well well-sm">
							<div class="row">
								<div class="col-xs-12">
									<span class="mouseHover">
										<xsl:apply-templates select="regulatory_project_manager1" />
									</span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-12">
									<span class="mouseHover">
										<xsl:apply-templates select="regulatory_project_manager2" />
									</span>
								</div>
							</div>
						</div>
					</xsl:if>
				</div>
			</div>
			<xsl:if test="fee_details !=''">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h2 class="panel-title">Fees</h2>
					</div>
					<div class="panel-body">
						<div class="well well-sm">
							<div class="row">
								<div class="col-xs-12">
									<strong> Submission class: </strong>
									<span class="mouseHover">
										<xsl:value-of select="fee_details/submission_class/@label_en" />
									</span>
								</div>
								<div class="col-xs-12">
									<strong>Submission description: </strong>
									<div class="col-xs-12">
										<span class="mouseHover">
											<xsl:value-of select="fee_details/submission_description/@label_en" />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div class="well well-sm">
							<div class="row">
								<div class="form-group col-xs-12 h3 text-info">Mitigation measures</div>
								<xsl:if test="fee_details/mitigation/mitigation_type !=''">
									<div class="col-xs-12">
										<div class="col-xs-12">
											<span class="mouseHover">
												<xsl:value-of
													select="fee_details/mitigation/mitigation_type/@label_en" />
											</span>
										</div>
									</div>
								</xsl:if>
								<div class="col-xs-12">
									<xsl:if	test="fee_details/mitigation/mitigation_type/@id = 'SMALL_BUSINESS'">
										<xsl:call-template name="hp-checkbox">
											<xsl:with-param name="value"
												select="fee_details/mitigation/certify_organization" />
										</xsl:call-template>
										<strong>We certify that we meet the definition of small business and have registered our company with
												Health Canada prior to submitting this submission/application. We understand that failure to
												register as a small business prior to submitting this submission/application will result in
												the full fee being charged.</strong>
										<div class="col-xs-12">
										<strong>We have not previously filed a submission/application in respect of a drug with Health Canada. We are filing our first submission/application.</strong>
											<span class="mouseHover">
												<xsl:call-template name="YesNoUnknow">
													<xsl:with-param name="value"
														select="fee_details/mitigation/small_business_fee_application" />
												</xsl:call-template>
											</span>
										</div>
									</xsl:if>
									<xsl:if test="fee_details/mitigation/mitigation_type/@id = 'URGENT_HEALTH_NEED'">
										<xsl:call-template name="hp-checkbox">
											<xsl:with-param name="value"
												select="fee_details/mitigation/certify_urgent_health_need" />
										</xsl:call-template>
										<strong>We certify that the drug in our submission/application is on the List of Drugs for an Urgent Public Health Need as per the Access to Drugs in Exceptional Circumstances Regulations and:</strong>
										<div class="col-xs-12">
											<ol class="lst-lwr-alph">
												<li>the drug has the same medicinal ingredient,	strength and route of administration, and is in a comparable dosage form, as a drug that may be imported under subsection C.10.001(2) of those Regulations;</li>
												<li>no drug identification number has been assigned	under section C.01.014.2 of those Regulations for the drug or for another drug that has the	same medicinal ingredient, strength and route of administration and is in a comparable dosage form; and</li>
												<li>no notice of compliance has been issued under section C.08.004 of those Regulations in respect of the drug or another drug that has the	same medicinal ingredient, strength and route of administration and is in a comparable dosage form.</li>
											</ol>
										</div>
									</xsl:if>
									<xsl:if test="fee_details/mitigation/mitigation_type/@id = 'FUNDED_INSTITUTION'">
										<xsl:call-template name="hp-checkbox">
											<xsl:with-param name="value"
												select="fee_details/mitigation/certify_funded_health_institution" />
										</xsl:call-template>
										<strong>We certify that our institution is funded by the Government of Canada or the government of a province or territory and that it is</strong>
										<div class="col-xs-12">
											<ol class="lst-lwr-alph">
												<li>licensed, approved or designated by a province in accordance with the laws of the province to provide care or treatment to persons or animals suffering from any form of disease or illness; or</li>
												<li>owned or operated by the Government of Canada or the government of a province and that provides health services.</li>
											</ol>
										</div>
									</xsl:if>
									<xsl:if	test="fee_details/mitigation/mitigation_type/@id = 'GOVERMENT_ORGANIZATION'">
										<xsl:call-template name="hp-checkbox">
											<xsl:with-param name="value"
												select="fee_details/mitigation/certify_government_organization" />
										</xsl:call-template>
										<strong>We certify that our organization is a branch or agency of the Government of Canada or of a province or territory</strong>
									</xsl:if>
									<xsl:if	test="fee_details/mitigation/mitigation_type/@id = 'ISAD'">
										<xsl:call-template name="hp-checkbox">
											<xsl:with-param name="value"
												select="fee_details/mitigation/certify_isad" />
										</xsl:call-template>
										<strong>We certify that we have filed an application for a designated COVID-19 drug under the Interim Order Respecting the Importation, Sale and Advertising of Drugs for Use in Relation to COVID-19 (ISAD), and that a submission has not previously been filed seeking approval for that same drug</strong>
									</xsl:if>
								</div>
							</div>
						</div>
					</div>
				</div>
			</xsl:if>
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h2 class="panel-title">Contact for this regulatory activity</h2>
				</div>
				<div class="panel-body">
					<strong>A. Company information: </strong>
					<div class="well well-sm">
						<div class="row">
							<div class="col-xs-12">
								<strong>Is the contact for this regulatory activity a third party
		corresponding on behalf of the manufacturer/sponsor? </strong>
								<span class="mouseHover">
									<xsl:call-template name="YesNoUnknow">
										<xsl:with-param name="value" select="is_third_party" />
									</xsl:call-template>
								</span>
							</div>
							<xsl:if test="is_third_party = 'Y'">
								<div class="col-xs-12">
									<strong>Company name (full legal name): </strong>
									<span class="mouseHover">
										<xsl:value-of select="company_name" />
									</span>
								</div>
							</xsl:if>
						</div>
					</div>
					<xsl:if test="is_third_party = 'Y'">
						<strong>B. Address information: </strong>
						<div class="well well-sm">
							<div class="row">
								<div class="col-xs-12">
									<strong>Street address: </strong>
									<span class="mouseHover">
										<xsl:value-of select="regulatory_activity_address/street_address" />
									</span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-4">
									<strong>City or town: </strong>
									<span class="mouseHover">
										<xsl:value-of select="regulatory_activity_address/city" />
									</span>
								</div>
								<div class="col-xs-4">
									<strong>Country: </strong>
									<span class="mouseHover">
										<xsl:value-of select="regulatory_activity_address/country/@label_en" />
									</span>
								</div>
							</div>
							<div class="row">
								<xsl:choose>
									<xsl:when test="regulatory_activity_address/country/@id = 'CA'">
										<div class="col-xs-4">
											<strong>Province: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_address/province_lov/@label_en" />
											</span>
										</div>
										<div class="col-xs-4">
											<strong>Postal code: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_address/postal_code" />
											</span>
										</div>
									</xsl:when>
									<xsl:when test="regulatory_activity_address/country/@id = 'US'">
										<div class="col-xs-4">
											<strong>State: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_address/province_lov/@label_en" />
											</span>
										</div>
										<div class="col-xs-4">
											<strong>Zip code: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_address/postal_code" />
											</span>
										</div>
									</xsl:when>
									<xsl:otherwise>
										<div class="col-xs-4">
											<strong>Province or state: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_address/province_text" />
											</span>
										</div>
										<div class="col-xs-4">
											<strong>Postal/ZIP code: </strong>
											<span class="mouseHover">
												<xsl:value-of select="regulatory_activity_address/postal_code" />
											</span>
										</div>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</div>
					</xsl:if>
					<h4>C. Company Representative: </h4>
					<div class="well well-sm">
						<div class="row">
								<strong class="col-xs-4">First name: <span
										class="mouseHover normalWeight">
										<xsl:value-of
											select="regulatory_activity_contact/given_name" />
									</span>
								</strong>
								<strong class="col-xs-4">Initials: <span
										class="mouseHover normalWeight">
										<xsl:value-of select="regulatory_activity_contact/initials" />
									</span>
								</strong>
								<strong class="col-xs-4">Last name: <span
										class="mouseHover normalWeight">
										<xsl:value-of select="regulatory_activity_contact/surname" />
									</span>
								</strong>
						</div>
						<div class="row">
							<strong class="col-xs-4"> Language of correspondence: <span
									class="mouseHover normalWeight">
									<xsl:value-of
										select="regulatory_activity_contact/language_correspondance/@label_en" />
								</span>
							</strong>
							<strong class="col-xs-8"> Job title: <span
								class="mouseHover normalWeight">
								<xsl:value-of
									select="regulatory_activity_contact/job_title" />
							</span>
							</strong>
						</div>
						<div class="row">
							<div class="col-xs-4">
								<strong>Phone number: </strong>
								<span class="mouseHover">
									<xsl:value-of select="regulatory_activity_contact/phone_num" />
								</span>
							</div>
							<div class="col-xs-4">
								<strong>Phone extension: </strong>
								<span class="mouseHover">
									<xsl:value-of select="regulatory_activity_contact/phone_ext" />
								</span>
							</div>
						</div>
						<div class="row">
							<strong class="col-xs-12"> Fax number: <span
									class="mouseHover normalWeight">
									<xsl:value-of select="regulatory_activity_contact/fax_num" />
								</span>
							</strong>
						</div>
						<div class="row">
							<strong class="col-xs-12"> Email: <span
									class="mouseHover normalWeight" style="font-weight:normal; ">
									<xsl:value-of select="regulatory_activity_contact/email" />
								</span>
							</strong>
						</div>
					</div>
					<div class="well well-sm">
						<div class="row">
							<strong>
								<xsl:call-template name="hp-checkbox">
									<xsl:with-param name="value"
										select="confirm_regulatory_contact" />
								</xsl:call-template>
								<span class="mouseHover">I confirm that the above regulatory activity contact information is valid.</span>
							</strong>
						</div>
					</div>
				</div>
			</div>
		</section>
	</xsl:template>

	<xsl:template name="YesNoUnknow">
		<xsl:param name="value" select="/.." />
		<xsl:choose>
			<xsl:when test="$value = 'Y'">
				<xsl:value-of select="'Yes'" />
			</xsl:when>
			<xsl:when test="$value = 'N'">
				<xsl:value-of select="'No'" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="'UNKNOWN'" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="hp-checkbox">
		<xsl:param name="value" select="/.." />
		<span class="c-checkbox">
			<xsl:choose>
				<xsl:when test="$value = 'Y'"> X </xsl:when>
				<xsl:otherwise> </xsl:otherwise>
			</xsl:choose>
		</span>
	</xsl:template>
</xsl:transform>

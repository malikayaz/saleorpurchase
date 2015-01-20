﻿<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebApplication1._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head profile="http://gmpg.org/xfn/11">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>saleorpurchase.com is on sale. Email us your offer</title>

    <meta name="keywords" content="Saleorpuchase, auction, offer, on sale" />
    <meta name="description" content="saleorpurchase.com is on sale. Email us your offer" />

    <link rel="stylesheet" href="./jshowoff.css" type="text/css" media="screen, projection" />

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
    <script type="text/javascript" src="./jquery.jshowoff.js"></script>

</head>
<body id="home" style="background-color: #E5EDF7;">
    <div id="wrap">
        <div id="features">
            <div id="action">
                <form id="frmEmail" runat="server">
                    <div style="width: 100%; float: left; text-align: left;">
                        <p id="version"><strong style="color: #ff0404;">saleorpurchase.com</strong> is on sale. If you want to buy please email us your offer.</p>
                    </div>
                    <div style="width: 50%; float: left; text-align: right; font-size: 12px;">Contact back Email Address:&nbsp;&nbsp;</div>
                    <div style="width: 50%; float: left; text-align: left;">
                        <asp:TextBox ID="txtEmail" runat="server"></asp:TextBox>
                    </div>
                    <div style="width: 50%; float: left; text-align: right; margin-top: 10px; font-size: 12px;">Your bid value (USD):&nbsp;&nbsp;</div>
                    <div style="width: 50%; float: left; text-align: left; margin-top: 10px">
                        <asp:TextBox ID="txtOffer" runat="server"></asp:TextBox>
                    </div>
                    <div style="width: 100%; float: left; margin-top: 25px;">
                        <p id="download">
                            <%--<a href="#">Sent Email</a>--%>
                            <asp:Button ID="btnEmail" runat="server" Text="Send Email" OnClick="btnEmail_Click" />

                        </p>
                    </div>
                    <div style="width: 100%; float: left; margin-top: 10px;">
                        <p id="P1">
                            <asp:Label runat="server" ForeColor="#ff0404" ID="lblMessage" Visible="false"></asp:Label>
                        </p>
                    </div>                    
                </form>
            </div>
            <!--end #action-->
        </div>
        <!--end #demo-->
        <!--end #wrap-->
    </div>   
</body>
</html>

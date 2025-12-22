import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SummaryApi from "../common";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const txnRef = params.get("vnp_TxnRef");
    const responseCode =
      params.get("vnp_ResponseCode") || params.get("vnp_TransactionStatus");

    if (!txnRef || !responseCode) {
      navigate("/payment/result", {
        replace: true,
        state: { status: "failed", message: "Thiếu tham số phản hồi từ VNPAY" },
      });
      return;
    }

    const verify = async () => {
      setVerifying(true);
      try {
        const res = await fetch(SummaryApi.orderVnpayReturn.url, {
          method: SummaryApi.orderVnpayReturn.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vnp_TxnRef: txnRef,
            vnp_ResponseCode: responseCode,
          }),
        });
        const data = await res.json();

        if (data.success && responseCode === "00") {
          navigate("/payment/result", {
            replace: true,
            state: {
              status: "success",
              message: "Thanh toán thành công",
              bookingCode: data?.data?.booking_code,
            },
          });
        } else {
          navigate("/payment/result", {
            replace: true,
            state: {
              status: "failed",
              message: data.message || "Thanh toán thất bại",
              bookingCode: data?.data?.booking_code,
            },
          });
        }
      } catch (error) {
        navigate("/payment/result", {
          replace: true,
          state: { status: "failed", message: "Không thể xác thực thanh toán" },
        });
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [navigate, params]);

  return (
    <div className="w-full min-h-screen bg-background-dark text-white font-display flex items-center justify-center px-4">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin mx-auto" />
        <h1 className="text-lg font-semibold">Đang xác thực giao dịch...</h1>
        <p className="text-white/60 text-sm">Vui lòng chờ trong giây lát.</p>
      </div>
    </div>
  );
};

export default PaymentReturn;

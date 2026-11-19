import logging
from uuid import UUID, uuid4

logger = logging.getLogger("divisha.requests")


def request_id(get_response):
    def middleware(request):
        try:
            request.request_id = UUID(request.headers.get("X-Request-ID", ""))
        except ValueError:
            request.request_id = uuid4()
        response = get_response(request)
        response["X-Request-ID"] = str(request.request_id)
        logger.info("request_id=%s method=%s status=%s", request.request_id,
                    request.method, response.status_code)
        return response

    return middleware

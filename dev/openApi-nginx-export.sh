#!/usr/bin/env bash
#
# oas2nginx.sh (c) NGINX, Inc. [v0.5 13-Jan-2020] Liam Crilly <liam.crilly@nginx.com>
#
# Converts OpenAPI/Swagger spec into nginx.conf snippet (server context) as per
#  https://www.nginx.com/blog/deploying-nginx-plus-as-an-api-gateway-part-1/
# Requires shyaml for YAML processing: https://github.com/0k/shyaml

# Defaults
#
BASEPATH=""
PREFIX_PATH=""
UPSTREAM="my_backend"

if [ $# -lt 1 ]; then
    echo "USAGE: ${0##*/} [options] oas_spec.yaml"
    echo "       Converts OpenAPI/Swagger spec into nginx.conf snippet"
    echo "       Options:"
    echo "       -b | --basepath <basePath>       # Override OAS basePath / servers path"
    echo "       -p | --prefix <prefix path>      # Apply further prefix to basePath"
    echo "       -u | --upstream <upstream name>  # Specify upstream group (default: $UPSTREAM)"
    exit 1
fi

which shyaml > /dev/null
if [ $? -ne 0 ]; then
    echo "${0##*/} ERROR: shyaml not found, see https://github.com/0k/shyaml"
    exit 1
fi

while [ $# -gt 1 ]; do
    case "$1" in
        "-b" | "--basepath")
            BASEPATH=$2
            shift; shift
            ;;
        "-p" | "--prefix")
            PREFIX_PATH=$2
            shift; shift
            ;;
        "-u" | "--upstream")
            UPSTREAM=$2
            shift; shift
            ;;
         *)
            echo "${0##*/} ERROR: Invalid command line option ($1)"
            exit 1
            ;;
    esac
done

if [ ! -f $1 ]; then
    echo "${0##*/} ERROR: Cannot open $1"
    exit 1
fi

if [ "$BASEPATH" == "" ]; then
    OAS_VERSION=`shyaml -q get-value openapi < $1`
    if [ $? -eq 0 ]; then
        echo "${0##*/} INFO: OpenAPI $OAS_VERSION" > /dev/stderr
        BASEPATH=`shyaml get-value servers < $1 2> /dev/null | grep url: | cut -f2- -d: | tail -1 | tr -d '[:blank:]'`
    else
        echo "${0##*/} INFO: OAS/Swagger v2" > /dev/stderr
        BASEPATH=`shyaml -q get-value basePath < $1`
    fi

    if [ "$BASEPATH" == "" ]; then
        echo "${0##*/}: WARNING: No basePath found in OAS" > /dev/stderr
        BASEPATH=/
    fi
fi
if [ "`echo $BASEPATH | grep -c http`" == "1" ]; then
    echo "${0##*/}: INFO: Stripping scheme and hostname from basepath URL" > /dev/stderr
    BASEPATH=/`echo $BASEPATH | cut -f4- -d/`
fi
echo "${0##*/}: INFO: Using basePath $BASEPATH"

if [ "$PREFIX_PATH" != "" ]; then
    echo "# Strip prefix"
    echo "rewrite ^$PREFIX_PATH/\(.*\)$ \1 last;"
    echo ""
fi

echo "location $BASEPATH/ {" | sed -e 's_//_/_g'
echo "    # Policy section here"
echo "    #"
echo "    error_page 403 = @405;"
echo ""

for SWAGGER_PATH in `shyaml keys paths < $1`; do
    # Convert path templates to regular expressions
    URI=`echo $SWAGGER_PATH | sed -e "s/\({.*}\)/\[\^\/\]\+/g"`

    if [ "$SWAGGER_PATH" == "$URI" ]; then
        # Exact match when no path templates
        echo "    location = $BASEPATH$URI {" | sed -e 's_//_/_g'
    else
        # Regex match
        echo "    location ~ ^$BASEPATH$URI\$ {" | sed -e 's_//_/_g'
    fi

    ESCAPED_PATH=`echo $SWAGGER_PATH | sed -e 's/\./\\\./g'`
    METHODS=`shyaml keys paths.$ESCAPED_PATH < $1 | grep -v parameters | tr '\n' ' '`
    if [ "$METHODS" != "" ]; then
        echo "        limit_except $METHODS{ deny all; }"
    fi

    echo "        proxy_pass http://$UPSTREAM;"
    echo "    }"
done

echo ""
echo "    return 404;"
echo "}"